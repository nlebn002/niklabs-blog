import type { Post, UpsertPostRequest } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function handle<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getPublishedPosts(): Promise<Post[]> {
  return handle<Post[]>(await fetch(`${apiBaseUrl}/api/posts`));
}

export async function getAdminPosts(adminKey: string): Promise<Post[]> {
  return handle<Post[]>(
    await fetch(`${apiBaseUrl}/api/admin/posts`, {
      headers: { "X-Admin-Key": adminKey }
    })
  );
}

export async function savePost(
  adminKey: string,
  request: UpsertPostRequest,
  postId?: string
): Promise<Post> {
  const url = postId
    ? `${apiBaseUrl}/api/admin/posts/${postId}`
    : `${apiBaseUrl}/api/admin/posts`;

  return handle<Post>(
    await fetch(url, {
      method: postId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": adminKey
      },
      body: JSON.stringify(request)
    })
  );
}

export async function deletePost(adminKey: string, postId: string): Promise<void> {
  return handle<void>(
    await fetch(`${apiBaseUrl}/api/admin/posts/${postId}`, {
      method: "DELETE",
      headers: { "X-Admin-Key": adminKey }
    })
  );
}

export async function uploadImage(adminKey: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await handle<{ url: string }>(
    await fetch(`${apiBaseUrl}/api/admin/uploads/images`, {
      method: "POST",
      headers: { "X-Admin-Key": adminKey },
      body: formData
    })
  );

  return result.url.startsWith("http") ? result.url : `${apiBaseUrl}${result.url}`;
}
