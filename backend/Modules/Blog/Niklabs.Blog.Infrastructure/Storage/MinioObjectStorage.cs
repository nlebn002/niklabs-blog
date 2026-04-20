using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Microsoft.Extensions.Options;
using Niklabs.Blog.Application.Abstractions;

namespace Niklabs.Blog.Infrastructure.Storage;

public sealed class MinioObjectStorage(IMinioClient minioClient, IOptions<ObjectStorageOptions> options) : IObjectStorage
{
    private readonly SemaphoreSlim _bucketLock = new(1, 1);
    private bool _bucketInitialized;
    private readonly ObjectStorageOptions _options = options.Value;

    public async Task<ObjectStorageUploadResult> UploadAsync(ObjectStorageUploadRequest request, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ObjectKey);
        ArgumentException.ThrowIfNullOrWhiteSpace(request.ContentType);
        ArgumentOutOfRangeException.ThrowIfNegative(request.ContentLength);
        ArgumentNullException.ThrowIfNull(request.Content);

        await EnsureBucketExistsAsync(cancellationToken);

        if (!request.Overwrite && await ExistsAsync(request.ObjectKey, cancellationToken))
        {
            throw new InvalidOperationException($"An object with key '{request.ObjectKey}' already exists.");
        }

        var putObjectArgs = new PutObjectArgs()
            .WithBucket(_options.Bucket)
            .WithObject(request.ObjectKey)
            .WithStreamData(request.Content)
            .WithObjectSize(request.ContentLength)
            .WithContentType(request.ContentType);

        await minioClient.PutObjectAsync(putObjectArgs, cancellationToken).ConfigureAwait(false);

        return new ObjectStorageUploadResult(request.ObjectKey, GetPublicUrl(request.ObjectKey));
    }

    public async Task DeleteAsync(string objectKey, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(objectKey);

        await EnsureBucketExistsAsync(cancellationToken);

        var removeObjectArgs = new RemoveObjectArgs()
            .WithBucket(_options.Bucket)
            .WithObject(objectKey);

        await minioClient.RemoveObjectAsync(removeObjectArgs, cancellationToken).ConfigureAwait(false);
    }

    public async Task<bool> ExistsAsync(string objectKey, CancellationToken cancellationToken)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(objectKey);

        await EnsureBucketExistsAsync(cancellationToken);

        try
        {
            var statObjectArgs = new StatObjectArgs()
                .WithBucket(_options.Bucket)
                .WithObject(objectKey);

            await minioClient.StatObjectAsync(statObjectArgs, cancellationToken).ConfigureAwait(false);
            return true;
        }
        catch (ObjectNotFoundException)
        {
            return false;
        }
    }

    public string GetPublicUrl(string objectKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(objectKey);

        var trimmedObjectKey = objectKey.TrimStart('/');
        var baseUrl = string.IsNullOrWhiteSpace(_options.PublicBaseUrl)
            ? BuildDefaultPublicBaseUrl()
            : _options.PublicBaseUrl.TrimEnd('/');

        return $"{baseUrl}/{trimmedObjectKey}";
    }

    private async Task EnsureBucketExistsAsync(CancellationToken cancellationToken)
    {
        if (_bucketInitialized)
        {
            return;
        }

        await _bucketLock.WaitAsync(cancellationToken).ConfigureAwait(false);

        try
        {
            if (_bucketInitialized)
            {
                return;
            }

            ValidateOptions();

            var bucketExistsArgs = new BucketExistsArgs()
                .WithBucket(_options.Bucket);

            var bucketExists = await minioClient.BucketExistsAsync(bucketExistsArgs, cancellationToken).ConfigureAwait(false);
            if (!bucketExists)
            {
                var makeBucketArgs = new MakeBucketArgs()
                    .WithBucket(_options.Bucket);

                await minioClient.MakeBucketAsync(makeBucketArgs, cancellationToken).ConfigureAwait(false);
            }

            _bucketInitialized = true;
        }
        finally
        {
            _bucketLock.Release();
        }
    }

    private void ValidateOptions()
    {
        if (string.IsNullOrWhiteSpace(_options.Endpoint))
        {
            throw new InvalidOperationException("Object storage endpoint is not configured.");
        }

        if (string.IsNullOrWhiteSpace(_options.AccessKey))
        {
            throw new InvalidOperationException("Object storage access key is not configured.");
        }

        if (string.IsNullOrWhiteSpace(_options.SecretKey))
        {
            throw new InvalidOperationException("Object storage secret key is not configured.");
        }

        if (string.IsNullOrWhiteSpace(_options.Bucket))
        {
            throw new InvalidOperationException("Object storage bucket is not configured.");
        }
    }

    private string BuildDefaultPublicBaseUrl()
    {
        var scheme = _options.UseSsl ? "https" : "http";
        return $"{scheme}://{_options.Endpoint.TrimEnd('/')}/{_options.Bucket}";
    }
}
