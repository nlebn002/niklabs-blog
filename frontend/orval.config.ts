/// <reference types="node" />

import { defineConfig } from "orval";

const openApiSpecPath = process.env.OPENAPI_SPEC_PATH ?? "./.orval/openapi-v1.json";

export default defineConfig({
  api: {
    input: {
      target: openApiSpecPath,
    },
    output: {
      mode: "tags-split",
      target: "./src/generated-openapi/api.ts",
      schemas: "./src/generated-openapi/models",
      clean: true,
      client: "fetch",
      httpClient: "fetch",
      override: {
        mutator: {
          path: "./src/services/api/client/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});