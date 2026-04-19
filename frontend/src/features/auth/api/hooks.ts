import { useMutation } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { postApiAuthChangePassword, postApiAuthLogin, postApiAuthLogout } from "../../../generated-openapi/auth/auth";
import { ChangePasswordRequest, LoginRequest } from "../../../generated-openapi/models";

export type CurrentUser = {
  userId: string;
  userName: string;
  email?: string | null;
  roles: string[];
};

const storageKey = "niklabs-current-user";
const storageEventName = "niklabs-current-user-changed";
let cachedRawValue: string | null | undefined;
let cachedCurrentUser: CurrentUser | null = null;

function readCurrentUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(storageKey);

  if (rawValue === cachedRawValue) {
    return cachedCurrentUser;
  }

  cachedRawValue = rawValue;

  if (!rawValue) {
    cachedCurrentUser = null;
    return null;
  }

  try {
    cachedCurrentUser = JSON.parse(rawValue) as CurrentUser;
    return cachedCurrentUser;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    cachedRawValue = null;
    cachedCurrentUser = null;
    return null;
  }
}

function notifyCurrentUserChanged() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(storageEventName));
}

function writeCurrentUser(user: CurrentUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    const rawValue = JSON.stringify(user);
    window.sessionStorage.setItem(storageKey, rawValue);
    cachedRawValue = rawValue;
    cachedCurrentUser = user;
  } else {
    window.sessionStorage.removeItem(storageKey);
    cachedRawValue = null;
    cachedCurrentUser = null;
  }

  notifyCurrentUserChanged();
}

function subscribeToCurrentUser(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === storageKey) {
      callback();
    }
  };

  window.addEventListener(storageEventName, callback);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(storageEventName, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useCurrentUser() {
  const data = useSyncExternalStore(subscribeToCurrentUser, readCurrentUser, () => null);

  return {
    data,
    isLoading: false
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const response = await postApiAuthLogin(payload);

      if (response.status === 401) {
        throw new Error(response.data.message);
      }

      return response.data as unknown as CurrentUser;
    },
    onSuccess: async (user) => {
      writeCurrentUser(user);
    }
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await postApiAuthLogout();
    },
    onSettled: async () => {
      writeCurrentUser(null);
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordRequest) => {
      const response = await postApiAuthChangePassword(payload);

      if (response.status === 400) {
        throw new Error(response.data.message);
      }

      if (response.status === 401) {
        throw new Error("Your session expired. Sign in again and retry.");
      }
    }
  });
}
