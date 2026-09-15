#!/usr/bin/env node
/**
 * Idempotent LocalSlip claim. Prints the leased port on stdout.
 * Missing CLI → warn on stderr, print the preferred port, exit 0.
 * Usage: node scripts/ensure-lease.mjs <name> <preferredPort>
 */
import { spawnSync } from "node:child_process";

const name = process.argv[2];
const preferred = process.argv[3];
if (!name || !preferred) {
	console.error("usage: node scripts/ensure-lease.mjs <name> <preferredPort>");
	process.exit(1);
}

const opt = {
	encoding: "utf8",
	timeout: 8000,
	windowsHide: true,
	shell: process.platform === "win32",
};

function getPort() {
	const got = spawnSync("localslip", ["get", name], { ...opt, stdio: ["ignore", "pipe", "pipe"] });
	if (got.status !== 0) return null;
	const port = String(got.stdout || "").trim();
	return /^\d+$/.test(port) ? port : null;
}

if (spawnSync("localslip", ["--help"], { ...opt, stdio: "ignore" }).error) {
	console.warn(`localslip: CLI not on PATH; FilePress will try port ${preferred}`);
	console.log(preferred);
	process.exit(0);
}

let port = getPort();
if (!port) {
	const claim = spawnSync(
		"localslip",
		["claim", name, "--port", preferred, "--or-next", "--notes", "FilePress"],
		{ ...opt, stdio: ["ignore", "pipe", "pipe"] },
	);
	if (claim.status !== 0) {
		console.warn(`localslip: claim ${name} failed; FilePress will try port ${preferred}`);
		if (claim.stderr) console.warn(String(claim.stderr).trim());
		console.log(preferred);
		process.exit(0);
	}
	port = getPort() ?? preferred;
}

console.log(port);
