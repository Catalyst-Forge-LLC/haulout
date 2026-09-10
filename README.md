# HaulOut

**Haul out the thread.**

Save the AI conversation you have open as Markdown or JSON, with speaker labels and available metadata. HaulOut runs in your browser and downloads the result. Nothing is uploaded.

> Haul out the thread. Then detangle it.

## Install (supported path)

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open [haulout.dev/haulout.user.js](https://haulout.dev/haulout.user.js) and accept the install, or paste [`haulout.user.js`](./haulout.user.js) into a new userscript.
3. Reload the chat tab.
4. Open the conversation.
5. Click **Haul out** at the bottom right, or press **Alt+Shift+E**.
6. Pick Markdown or JSON. The file lands in Downloads.

Claude often blocks `javascript:` bookmarklets. The userscript is the supported path. Violentmonkey, Greasemonkey, bookmarklet, and console paste live in [`fallback/`](./fallback/) and are not presented as equally reliable.

## What you get

```text
haulout-2026-09-02-chatgpt-kitchen-reno.md
```

- YAML front matter (`exported_at`, `platform`, `source`, `url`, `title`, `project`, …)
- One heading per turn: `### You · turn 1 — 2026-08-30T14:11:02.000Z` (clock omitted when the site has none)
- JSON with the same fields and a `turns` array
- `source: api` when HaulOut read the site’s conversation endpoint
- `source: dom` when it had to read the rendered thread after scrolling

Sanitized samples: [`examples/kitchen-reno.md`](./examples/kitchen-reno.md), [`examples/kitchen-reno.json`](./examples/kitchen-reno.json). This is the **open** conversation, not a bulk account archive.

## How you know it finished

The button shows `{n} turns · API|DOM · MD|JSON`. `n` is the turns collected, not a proof the provider stored exactly that many. Empty extract fails. The scroll walk has a step cap. See [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## Why it scrolls

These UIs virtualize the thread. Only a window of turns exists in the DOM. HaulOut goes to the top, waits for older turns, then walks down before it reads. ChatGPT, Claude, and grok.com are API-first; the scroll pass is still a safety net. Gemini and Grok-on-X are DOM-first.

## Limits

- This is the **open** conversation, not a bulk account archive.
- Per-turn clocks are often missing from the page. API hauls are the ones with real timestamps.
- Images and uploads are referenced, not zipped.
- `x.com/i/grok` uses hashed classes and will break first.
- Official full-account exports still exist and are better for everything you ever said.

## Site

[haulout.dev](https://haulout.dev) is a FilePress site in [`site/`](./site/). Locally:

```bash
pnpm --dir site install
pnpm dev
```

If [LocalSlip](https://localslip.dev) is installed, the site stays on **5198** as `haulout-site`.

Product spec: [`docs/SPEC.md`](./docs/SPEC.md). Compatibility snapshot: [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## License

MIT. Unofficial. Not affiliated with the chat sites.
