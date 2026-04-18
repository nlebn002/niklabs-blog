import type {
  CsrfTokenResponse,
  CurrentUserDto,
  ErrorResponse,
  GetApiPostsParams,
  LoginRequest,
  PostDto,
  UpsertPostRequest
} from "./";
import { customFetch } from "../client/custom-fetch";

export type getApiPostsResponse =
  | { data: PostDto[]; status: 200; headers: Headers };

export const getApiPosts = async (params?: GetApiPostsParams, options?: RequestInit): Promise<getApiPostsResponse> => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined) {
      normalizedParams.append(key, value === null ? "null" : value.toString());
    }
  });

  const query = normalizedParams.toString();
  const path = query.length > 0 ? `/api/posts?${query}` : "/api/posts";

  return customFetch<getApiPostsResponse>(path, {
    ...options,
    method: "GET"
  });
};

export type getApiPostsIdResponse =
  | { data: PostDto; status: 200; headers: Headers }
  | { data: void; status: 404; headers: Headers };

export const getApiPostsId = async (id: string, options?: RequestInit): Promise<getApiPostsIdResponse> =>
  customFetch<getApiPostsIdResponse>(`/api/posts/${id}`, {
    ...options,
    method: "GET"
  });

export type postApiPostsResponse =
  | { data: PostDto; status: 201; headers: Headers }
  | { data: void; status: 403; headers: Headers };

export const postApiPosts = async (
  upsertPostRequest: UpsertPostRequest,
  options?: RequestInit
): Promise<postApiPostsResponse> =>
  customFetch<postApiPostsResponse>("/api/posts", {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(upsertPostRequest)
  });

export type putApiPostsIdResponse =
  | { data: PostDto; status: 200; headers: Headers }
  | { data: void; status: 403; headers: Headers }
  | { data: void; status: 404; headers: Headers };

export const putApiPostsId = async (
  id: string,
  upsertPostRequest: UpsertPostRequest,
  options?: RequestInit
): Promise<putApiPostsIdResponse> =>
  customFetch<putApiPostsIdResponse>(`/api/posts/${id}`, {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(upsertPostRequest)
  });

export type deleteApiPostsIdResponse =
  | { data: void; status: 204; headers: Headers }
  | { data: void; status: 403; headers: Headers }
  | { data: void; status: 404; headers: Headers };

export const deleteApiPostsId = async (id: string, options?: RequestInit): Promise<deleteApiPostsIdResponse> =>
  customFetch<deleteApiPostsIdResponse>(`/api/posts/${id}`, {
    ...options,
    method: "DELETE"
  });

export type getApiAuthMeResponse =
  | { data: CurrentUserDto; status: 200; headers: Headers }
  | { data: void; status: 401; headers: Headers };

export const getApiAuthMe = async (options?: RequestInit): Promise<getApiAuthMeResponse> =>
  customFetch<getApiAuthMeResponse>("/api/auth/me", {
    ...options,
    method: "GET"
  });

export type getApiAuthCsrfResponse =
  | { data: CsrfTokenResponse; status: 200; headers: Headers };

export const getApiAuthCsrf = async (options?: RequestInit): Promise<getApiAuthCsrfResponse> =>
  customFetch<getApiAuthCsrfResponse>("/api/auth/csrf", {
    ...options,
    method: "GET"
  });

export type postApiAuthLoginResponse =
  | { data: CurrentUserDto; status: 200; headers: Headers }
  | { data: ErrorResponse; status: 401; headers: Headers };

export const postApiAuthLogin = async (
  loginRequest: LoginRequest,
  options?: RequestInit
): Promise<postApiAuthLoginResponse> =>
  customFetch<postApiAuthLoginResponse>("/api/auth/login", {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...options?.headers },
    body: JSON.stringify(loginRequest)
  });

export type postApiAuthLogoutResponse =
  | { data: void; status: 204; headers: Headers }
  | { data: void; status: 401; headers: Headers };

export const postApiAuthLogout = async (options?: RequestInit): Promise<postApiAuthLogoutResponse> =>
  customFetch<postApiAuthLogoutResponse>("/api/auth/logout", {
    ...options,
    method: "POST"
  });
