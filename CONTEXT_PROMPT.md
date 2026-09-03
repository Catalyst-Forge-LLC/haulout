# HaulOut — project context

Merged from `docs/PHASE_1_BRIEF.md` on 2026-09-03. Brief stays in `docs/` as the audit trail.

## What it is

HaulOut pulls the **open** conversation off ChatGPT, Claude, Gemini, Grok, and SuperGrok as Markdown or JSON. Tampermonkey userscript first; bookmarklet/console fallback. Local download only. No HaulOut server.

Hero: open a logged-in thread → **Haul out** (or Alt+Shift+E) → pick MD or JSON → file in Downloads.

## Tech stack

- Userscript: `haulout.user.js` at repo root (GitHub raw / Greasy Fork)
- Fallback: `fallback/haulout.js`, `fallback/haulout.bookmarklet.txt`
- Site: FilePress (`getfilepress`) in `site/` → haulout.dev
- Language: JS for the userscript (single file); TS/ESM for site scripts
- Package manager: pnpm
- Deploy: Cloudflare Pages, `wrangler pages deploy --project-name=haulout`
- LocalSlip: `haulout-site` on **5198**
- LocalHelm: enroll `haulout`
- Process: ForgeTrail in `.forgetrail/`
- No PocketBase, no auth, no LLM, no telemetry

## Project structure

```
haulout.user.js          userscript (install URL)
fallback/                bookmarklet + console
docs/                    SPEC, PHASE_1_BRIEF, greasy-fork notes
examples/                sample haul
site/                    FilePress (pages/, theme.css)
scripts/                 site-dev, ensure-lease, sync-static
```

## Data model

One **haul** per export. Filename `haulout-YYYY-MM-DD-<platform>-<slug>.{md,json}`.

Turns: `role` is `user` | `assistant`. `speaker` is You / ChatGPT / Claude / Gemini / Grok. Omit timestamp rather than invent one. `source` is `api` or `dom`. `exporter` is `haulout`.

Platforms: `chatgpt`, `claude`, `gemini`, `grok`, `grok-x`.

## Key architectural decisions

- **DECIDED Phase 1 — D1.** Frozen names. Do not reopen. WHY: SPEC §1 / §15.
- **DECIDED Phase 1 — D2.** Userscript, not extension or server. WHY: page-origin cookies; same-origin fetch.
- **DECIDED Phase 1 — D3.** MD + JSON only. WHY: readable and diffable.
- **DECIDED Phase 1 — D4.** Open conversation only. WHY: official takeouts cover bulk.
- **DECIDED Phase 1 — D5.** FilePress + LocalSlip + LocalHelm. WHY: house stack; nothing to persist server-side.
- **DECIDED Phase 1 — D6.** Userscript stays at repo root. WHY: stable raw URL.
- **DECIDED Phase 1 — D7.** Detangler is the next tool, not a mode.
- **DECIDED Phase 1 — D8.** No PocketBase/auth/payment exit criteria.

## Critical patterns

- Isolate platform adapters from Markdown/JSON rendering. Selectors rot.
- Prefer API when it yields turns; do not silently pad from DOM.
- Host `/haulout.user.js` via `scripts/sync-static.mjs` — do not edit the copy in `site/static/`.
- Button label is **Haul out**. FAB id `haulout-fab`. Overlay `haulout-ui`.

## Design / voice

Short. Imperative. No “powerful / seamless / effortlessly.” No “AI-powered.” Dark `#0b0b0c`, zinc text, one warm metal accent. Wordmark is the word.

Good: “Haul out this conversation.”
Bad: “Rescue your AI memories with one click.”

## Current feature state

### Complete

- Working userscript (five platforms, scroll hydrate, API-first where it exists)
- Rename pass on the userscript (frozen strings, filename, ids)
- FilePress one-pager + LocalSlip/LocalHelm wiring

### In Progress

- Greasy Fork listing (sync from https://haulout.dev/haulout.user.js; GitHub still private)
- SPEC §14 acceptance on live chat sites

### Not Started

- Swap haulout.dev hero CTA to the Greasy Fork Install URL once the script id exists
- Copy-to-clipboard / remember last format (v1.1)
- Gemini RPC (v1.2)

## Recent changes

### Session 2 — 2026-09-03

haulout.dev live. Greasy Fork listing pack. Userscript 1.1.2 updates from haulout.dev (GitHub still private).

### Session 1 — 2026-09-03

Kickoff. Moved root dump into `docs/`, `fallback/`, `examples/`, `site/`. Renamed userscript. Scaffolded FilePress on 5198.
