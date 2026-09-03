# HaulOut

**Haul out the thread.**

HaulOut pulls the open conversation off ChatGPT, Claude, Gemini, Grok, and SuperGrok as Markdown or JSON. Speakers, clocks when the site has them, title and project, and an export timestamp so two hauls of the same URL can be compared.

It runs in your browser. Nothing is uploaded.

> Haul out the thread. Then detangle it.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) (or Violentmonkey).
2. Open [`haulout.user.js`](./haulout.user.js) raw and accept the install, or paste it into a new userscript.
3. Reload the chat tab.
4. Click **Haul out** at the bottom right, or press **Alt+Shift+E**.

Claude and some other hosts block `javascript:` bookmarklets. The userscript is the supported path.

Bookmarklet and console fallbacks live in [`fallback/`](./fallback/).

## What you get

```text
haulout-2026-09-02-chatgpt-kitchen-reno.md
```

- YAML front matter (`exported_at`, `platform`, `source`, `url`, `title`, `project`, …)
- One heading per turn: `### You · turn 1 — 2026-08-30T14:11:02.000Z`
- JSON with the same fields and a `turns` array
- `source: api` when HaulOut read the site’s own conversation endpoint
- `source: dom` when it had to read the rendered thread after scrolling

A sample haul is in [`examples/kitchen-reno.md`](./examples/kitchen-reno.md).

## Why it scrolls

These UIs virtualize the thread. Only a window of turns exists in the DOM. HaulOut goes to the top, waits for older turns, then walks down before it reads. ChatGPT, Claude, and grok.com are API-first; the scroll pass is still a safety net. Gemini and Grok-on-X are DOM-first.

## Limits

- This is the **open** conversation, not a bulk account archive.
- Per-turn clocks are often missing from the page. API hauls are the ones with real timestamps.
- Images and uploads are referenced, not zipped.
- `x.com/i/grok` uses hashed classes and will break first.
- Official full-account exports still exist and are better for “everything I ever said.”

## Site

[haulout.dev](https://haulout.dev) is a FilePress site in [`site/`](./site/). Locally:

```bash
pnpm --dir site install
pnpm dev
```

If [LocalSlip](https://localslip.dev) is installed, the site stays on **5198** as `haulout-site`.

Product spec: [`docs/SPEC.md`](./docs/SPEC.md).

## License

MIT. Unofficial. Not affiliated with the chat sites.
