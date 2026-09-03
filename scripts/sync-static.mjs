#!/usr/bin/env node
/**
 * Copy the userscript and sample haul into site/static for haulout.dev.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "site", "static");
mkdirSync(dest, { recursive: true });
copyFileSync(join(root, "haulout.user.js"), join(dest, "haulout.user.js"));
copyFileSync(join(root, "examples", "kitchen-reno.md"), join(dest, "example.md"));
