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
      target: "./src/generated-openapi/auth/apis/index.ts",
      schemas: "./src/generated-openapi/auth/models",
      clean: true,
      client: "fetch",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/services/api/client/custom-fetch.ts",
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
      target: "./src/generated-openapi/blog/apis/index.ts",
      schemas: "./src/generated-openapi/blog/models",
      clean: true,
      client: "fetch",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/services/api/client/custom-fetch.ts",
          name: "customFetch"
        }
      }
    }
  }
});
