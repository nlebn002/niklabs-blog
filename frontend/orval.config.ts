import { defineConfig } from "orval";

export default defineConfig({
  blogApi: {
    input: {
      target: process.env.ORVAL_OPENAPI_URL ?? "http://localhost:5000/openapi/v1.json"
    },
    output: {
      mode: "split",
      target: "./src/shared/api/generated/blog-api.ts",
      schemas: "./src/shared/api/generated",
      client: "fetch",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/shared/api/client/custom-fetch.ts",
          name: "customFetch"
        }
      }
    }
  }
});
