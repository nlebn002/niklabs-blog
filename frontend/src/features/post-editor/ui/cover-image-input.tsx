import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { uploadCoverImage } from "../../../services/api/media";

type CoverImageInputProps = {
  initialImageUrl?: string | null;
  onChange: (value: { mediaAssetId: string | null; imageUrl: string | null }) => void;
};

export function CoverImageInput({ initialImageUrl, onChange }: CoverImageInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const localPreviewUrlRef = useRef<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  function clearLocalPreviewUrl() {
    if (localPreviewUrlRef.current) {
      URL.revokeObjectURL(localPreviewUrlRef.current);
      localPreviewUrlRef.current = null;
    }
  }

  function showLocalPreview(file: File) {
    clearLocalPreviewUrl();
    const previewUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = previewUrl;
    setImageUrl(previewUrl);
  }

  useEffect(() => {
    clearLocalPreviewUrl();
    setImageUrl(initialImageUrl ?? null);

    return clearLocalPreviewUrl;
  }, [initialImageUrl]);

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    showLocalPreview(file);

    try {
      const uploaded = await uploadCoverImage(file);
      onChange({ mediaAssetId: uploaded.mediaAssetId, imageUrl: uploaded.publicUrl });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div
        className="grid min-h-[14rem] place-items-center rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center"
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={async (event) => {
          const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith("image/"));
          if (!file) {
            return;
          }

          event.preventDefault();
          await handleFile(file);
        }}
        onPaste={async (event) => {
          const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith("image/"));
          if (!file) {
            return;
          }

          event.preventDefault();
          await handleFile(file);
        }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Cover preview" className="max-h-[18rem] w-full rounded-[11px] border border-border object-cover" />
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Paste, drop, or choose an image.</p>
            <p>The uploaded image is shown immediately as the cover preview.</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={isUploading} onClick={() => inputRef.current?.click()}>
          {isUploading ? "Uploading..." : imageUrl ? "Replace Cover Image" : "Choose Cover Image"}
        </Button>
        {imageUrl ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              clearLocalPreviewUrl();
              setImageUrl(null);
              onChange({ mediaAssetId: null, imageUrl: null });
            }}
          >
            Remove
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            await handleFile(file);
          }

          event.target.value = "";
        }}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
