import { env } from "../../config/env";
import { toErrorMessage } from "../../lib/errors";

export async function customFetch<TData>(
  path: string,
  options?: RequestInit
): Promise<TData> {
  const requestUrl = env.apiBaseUrl.startsWith("http")
    ? new URL(path, env.apiBaseUrl).toString()
    : `${env.apiBaseUrl.replace(/\/$/, "")}${path}`;
  const response = await fetch(requestUrl, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options?.headers
    }
  });

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
