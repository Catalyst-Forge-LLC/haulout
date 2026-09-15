#!/usr/bin/env node
/**
 * Sync static copies, then start FilePress.
 * Port comes from LocalSlip (`haulout-site`). Claim in package.json.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");
const node = process.execPath;
function run(args, cwd = root) {
	const result = spawnSync(node, args, { cwd, stdio: "inherit" });
	if (result.status !== 0) process.exit(result.status ?? 1);
}

const filepressBin = join(
	site,
	"node_modules",
	".bin",
	process.platform === "win32" ? "filepress.CMD" : "filepress",
);
if (!existsSync(filepressBin)) {
	console.error("filepress is not installed. From the repo root: pnpm --dir site install");
	process.exit(1);
}

run([join(root, "scripts/sync-static.mjs")]);

const child = spawn(filepressBin, ["dev", "--host", "0.0.0.0"], {
	cwd: site,
	stdio: "inherit",
	shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 1));
