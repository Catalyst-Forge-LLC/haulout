#!/usr/bin/env node
/**
 * Sync static copies, claim/read the LocalSlip lease, then start FilePress.
 */
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");
const node = process.execPath;
const preferred = "5198";
const leaseName = "haulout-site";

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

const lease = spawnSync(node, [join(root, "scripts/ensure-lease.mjs"), leaseName, preferred], {
	encoding: "utf8",
	windowsHide: true,
});
const port = String(lease.stdout || "").trim() || preferred;
if (lease.stderr) process.stderr.write(lease.stderr);
console.log(`${leaseName}: http://127.0.0.1:${port}`);

const child = spawn(filepressBin, ["dev", "--host", "0.0.0.0", "--port", port], {
	cwd: site,
	stdio: "inherit",
	shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 1));
