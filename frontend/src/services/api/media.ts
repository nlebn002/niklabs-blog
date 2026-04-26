import { customFetch } from "./client/custom-fetch";

export type UploadImageResponse = {
  mediaAssetId: string;
  publicUrl: string;
  contentType: string;
  sizeBytes: number;
  width: number;
  height: number;
  altText: string | null;
};

type UploadImageApiResponse = {
  data: UploadImageResponse;
  headers: Headers;
  status: number;
};

export async function uploadCoverImage(file: File, altText?: string): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  if (altText?.trim()) {
    formData.append("altText", altText.trim());
  }

  const response = await customFetch<UploadImageApiResponse>("/api/media/images?kind=Cover", {
    method: "POST",
    body: formData
  });

  if (response.status !== 200) {
    throw new Error("Failed to upload cover image.");
  }

  return response.data;
}
