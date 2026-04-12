function readEnv(name: "VITE_API_BASE_URL", fallback: string) {
  return import.meta.env[name] ?? fallback;
}

export const env = {
  apiBaseUrl: readEnv("VITE_API_BASE_URL", "/")
};
