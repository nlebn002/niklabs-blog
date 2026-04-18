import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const apiUrl = process.env.API_URL ?? "http://localhost:5001";
const openApiUrl = new URL("/openapi/v1.json", apiUrl.endsWith("/") ? apiUrl : `${apiUrl}/`);
const outputDir = resolve(".orval");
const outputFile = resolve(outputDir, "openapi-v1.json");

async function fetchSpec() {
  const response = await fetch(openApiUrl, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI from ${openApiUrl} (${response.status} ${response.statusText})`);
  }

  const body = await response.text();
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, body, "utf8");
}

function runOrval(args) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(
      process.execPath,
      ["./node_modules/orval/dist/bin/orval.js", "--config", "orval.config.ts", ...args],
      {
        stdio: "inherit",
        env: {
          ...process.env,
          OPENAPI_SPEC_PATH: outputFile
        }
      }
    );

    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      rejectPromise(new Error(`Orval exited with code ${code ?? "unknown"}`));
    });

    child.on("error", rejectPromise);
  });
}

await fetchSpec();
await runOrval(process.argv.slice(2));
