import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const envLocalPath = resolve(projectRoot, ".env.local");

if (existsSync(envLocalPath)) {
  const envLocal = readFileSync(envLocalPath, "utf8");

  for (const line of envLocal.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

process.env.SUPABASE_TELEMETRY_DISABLED = "1";

const args = process.argv.slice(2);

if (
  args[0] === "link" &&
  process.env.SUPABASE_PROJECT_REF &&
  !args.some(
    (arg) => arg === "--project-ref" || arg.startsWith("--project-ref="),
  )
) {
  args.push("--project-ref", process.env.SUPABASE_PROJECT_REF);
}

const cliPath = resolve(
  projectRoot,
  "node_modules/@supabase/cli-darwin-arm64/bin/supabase",
);
const result = spawnSync(cliPath, args, {
  cwd: projectRoot,
  env: process.env,
  stdio: "inherit",
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);
