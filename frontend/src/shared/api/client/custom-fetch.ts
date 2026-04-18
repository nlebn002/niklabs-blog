import { env } from "../../config/env";
import { toErrorMessage } from "../../lib/errors";

let csrfToken: string | null = null;

function toRequestUrl(path: string) {
  return env.apiBaseUrl.startsWith("http")
    ? new URL(path, env.apiBaseUrl).toString()
    : `${env.apiBaseUrl.replace(/\/$/, "")}${path}`;
}

async function ensureCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  const response = await fetch(toRequestUrl("/api/auth/csrf"), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { requestToken?: string };
  csrfToken = payload.requestToken ?? null;
  return csrfToken;
}

export async function customFetch<TData>(
  path: string,
  options?: RequestInit
): Promise<TData> {
  const requestUrl = toRequestUrl(path);
  const method = options?.method?.toUpperCase() ?? "GET";
  const headers = new Headers({
    Accept: "application/json",
    ...(options?.headers as HeadersInit | undefined)
  });

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method) && !headers.has("X-CSRF-TOKEN")) {
    const token = await ensureCsrfToken();
    if (token) {
      headers.set("X-CSRF-TOKEN", token);
    }
  }

  const response = await fetch(requestUrl, {
    ...options,
    credentials: "include",
    headers: {
      ...Object.fromEntries(headers.entries())
    }
  });

  if (response.status === 401) {
    csrfToken = null;
  }

  if (response.status >= 500) {
    throw new Error(await toErrorMessage(response));
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return {
      data: undefined,
      headers: response.headers,
      status: response.status
    } as TData;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  return {
    data,
    headers: response.headers,
    status: response.status
  } as TData;
}
