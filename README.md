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

## Compatibility

**Supported sites.** HaulOut 1.1.4 has an adapter for ChatGPT (chatgpt.com, chat.openai.com), Claude (claude.ai), Gemini (gemini.google.com), Grok (grok.com), and Grok on X (`x.com/i/grok`).

**Last checked working.** Each date is the most recent successful haul on record, taken from the file's `exported_at` timestamp (UTC). There are no automated tests against the live sites.

| Site | Last checked working | Version |
| --- | --- | --- |
| ChatGPT | 2026-09-21 | 1.1.4 |
| Grok (grok.com) | 2026-09-21 | 1.1.4 |
| Claude | 2026-09-09 | 1.1.3 |
| Gemini | 2026-09-09 | 1.1.3 |
| Grok on X | Not recently verified | |

Per-site notes: [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## What you get

```text
haulout-2026-09-02-chatgpt-kitchen-reno.md
```

- YAML front matter (`exported_at`, `platform`, `source`, `url`, `title`, `project`, …)
- One heading per turn: `### You · turn 1 — 2026-08-30T14:11:02.000Z` (timestamp left out when the site has none)
- JSON with the same fields and a `turns` array
- `source: api` when HaulOut read the site’s conversation endpoint
- `source: dom` when it had to read the rendered thread after scrolling

Sanitized samples: [`examples/kitchen-reno.md`](./examples/kitchen-reno.md), [`examples/kitchen-reno.json`](./examples/kitchen-reno.json). This is the **open** conversation, not a bulk account archive.

## How you know it finished

The HaulOut panel shows `{n} turns · API|DOM · MD|JSON`. `n` is the turns collected, not proof that the provider stored exactly that many. An empty extract fails with an error. The scroll walk has a step cap.

## Why it scrolls

Chat sites keep only part of a long thread on the page at a time. HaulOut scrolls to the top, waits for older turns to load, then walks down before it reads. ChatGPT, Claude, and grok.com are read from the conversation API first; the scroll pass is still a safety net. Gemini and Grok on X are read from the page.

## Limits

- This is the **open** conversation, not a bulk account archive.
- Per-turn timestamps are often missing from the page. API hauls are the ones with real timestamps.
- Images and uploads are referenced, not zipped.
- Grok on X uses generated class names and will break first.
- Official full-account exports still exist and are better for everything you ever said.

## Site

[haulout.dev](https://haulout.dev) is a FilePress site in [`site/`](./site/). Locally:

```bash
pnpm --dir site install
pnpm dev
```

`pnpm dev` claims port **5198** as `haulout-site` through [LocalSlip](https://localslip.dev) and fails if LocalSlip is not installed. Without it, run `pnpm --dir site dev`.

Product spec: [`docs/SPEC.md`](./docs/SPEC.md). Compatibility record: [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## License

MIT. Unofficial. Not affiliated with the chat sites.

[See the rest of the Catalyst Forge shelf.](https://catalystforge.com/tools/)
