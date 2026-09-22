---
title: Haul out the thread.
description: Save the open ChatGPT, Claude, Gemini, or Grok conversation as Markdown or JSON. Local only.
order: 0
---

Save the AI conversation you have open as Markdown or JSON, with speaker labels and available metadata. HaulOut runs in your browser and downloads the result. Nothing is uploaded.

[Install userscript](/haulout.user.js) · [View a sample haul](/example.md) · [Compatibility](#compatibility)

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open [haulout.user.js](/haulout.user.js) and accept the install.
3. Reload the chat tab.
4. Open the conversation you want.
5. Click **Haul out** at the bottom right, or press **Alt+Shift+E**.
6. Pick Markdown or JSON. The file lands in Downloads.

That is the path this project supports. Claude often blocks `javascript:` bookmarklets. The userscript is the one that works there.

## What a haul contains

The [sample Markdown](/example.md) is a sanitized ChatGPT API fixture, not an account archive.

- **Speakers:** `You` and `ChatGPT` (or the host label)
- **Title and project** when the page has them
- **Per-turn timestamps** when the site stores them. Missing timestamps are left out, not invented
- **`exported_at`** so two hauls of the same URL can be compared
- **`source`:** `api` (conversation endpoint) or `dom` (rendered turns after scroll)

JSON is the same fields plus a `turns` array. [Sample JSON](/example.json). Images and uploads are referenced, not zipped.

## How you know it finished

The HaulOut panel shows `{n} turns · API|DOM · MD|JSON`. `n` is what HaulOut collected. It is not proof that the provider stored exactly that many turns. An empty extract fails with an error. Chat sites keep only part of a long thread on the page, so HaulOut scrolls the thread first to load older turns. That scroll has a step cap, so a very long thread can come out short.

## Compatibility

**Supported sites.** HaulOut 1.1.4 has an adapter for ChatGPT (chatgpt.com, chat.openai.com), Claude (claude.ai), Gemini (gemini.google.com), Grok (grok.com), and Grok on X (`x.com/i/grok`). ChatGPT, Claude, and Grok read the site's conversation API first. Gemini and Grok on X read the page after scrolling, so they break first when a site changes its layout.

**Last checked working.** Each date is the most recent successful haul on record, taken from the file's `exported_at` timestamp (UTC). There are no automated tests against the live sites.

| Site | Last checked working | Version |
| --- | --- | --- |
| ChatGPT | 2026-09-21 | 1.1.4 |
| Grok (grok.com) | 2026-09-21 | 1.1.4 |
| Claude | 2026-09-09 | 1.1.3 |
| Gemini | 2026-09-09 | 1.1.3 |
| Grok on X | Not recently verified | |

Details and notes per site: [`docs/COMPATIBILITY.md`](https://github.com/Catalyst-Forge-LLC/haulout/blob/main/docs/COMPATIBILITY.md).

## Advanced fallbacks

These are not as reliable as Tampermonkey.

- **Violentmonkey / Greasemonkey:** may work, not verified.
- **Bookmarklet:** drag from [`fallback/`](https://github.com/Catalyst-Forge-LLC/haulout/tree/main/fallback). Claude often blocks `javascript:`.
- **Console:** paste [`haulout.js`](https://github.com/Catalyst-Forge-LLC/haulout/blob/main/fallback/haulout.js).

## Privacy

No HaulOut backend. The script talks only to the chat site you have open. Its one userscript permission is `GM_info`, which reads its own version. You can read the script.

## Limits

Not a full-account archive. Official bulk exports still exist and are better for everything you ever said. A site layout change can break hauls from that site until HaulOut is updated. Images and uploads are not bundled.

## Family

> Haul out the thread. Then detangle it.

[Detangler](https://detangler.dev) is the next tool, not a HaulOut mode.

## Legal

HaulOut is an unofficial local tool. It is not affiliated with OpenAI, Anthropic, Google, xAI, or X. Private web APIs and page structure change. Hauls can be incomplete. You are responsible for how you keep and share your own transcripts.

MIT · [GitHub](https://github.com/Catalyst-Forge-LLC/haulout) · [Spec](/spec)
