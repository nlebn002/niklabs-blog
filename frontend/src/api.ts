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
  return handle<Post[]>(await fetch(`${apiBaseUrl}/api/posts?isPublished=true`));
}

export async function getAdminPosts(): Promise<Post[]> {
  return handle<Post[]>(await fetch(`${apiBaseUrl}/api/posts`));
}

export async function savePost(request: UpsertPostRequest, postId?: string): Promise<Post> {
  const url = postId ? `${apiBaseUrl}/api/posts/${postId}` : `${apiBaseUrl}/api/posts`;

  return handle<Post>(
    await fetch(url, {
      method: postId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    })
  );
}

export async function deletePost(postId: string): Promise<void> {
  return handle<void>(await fetch(`${apiBaseUrl}/api/posts/${postId}`, { method: "DELETE" }));
}
