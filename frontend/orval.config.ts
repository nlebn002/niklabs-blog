/// <reference types="node" />

import { defineConfig } from "orval";

const openApiSpecPath = process.env.OPENAPI_SPEC_PATH ?? "./.orval/openapi-v1.json";

export default defineConfig({
  auth: {
    input: {
      target: openApiSpecPath,
      filters: {
        tags: ["Auth"]
      }
    },
    output: {
      mode: "single",
      target: "./src/shared/api/generated/auth/apis/index.ts",
      schemas: "./src/shared/api/generated/auth/models",
      clean: true,
      client: "fetch",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/shared/api/client/custom-fetch.ts",
          name: "customFetch"
        }
      }
    }
  },
  blog: {
    input: {
      target: openApiSpecPath,
      filters: {
        tags: ["Blog", "Posts"]
      }
    },
    output: {
      mode: "single",
      target: "./src/shared/api/generated/blog/apis/index.ts",
      schemas: "./src/shared/api/generated/blog/models",
      clean: true,
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
