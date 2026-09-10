---
title: Haul out the thread.
description: Save the open ChatGPT, Claude, Gemini, Grok, or SuperGrok conversation as Markdown or JSON. Local only.
order: 0
---

Save the AI conversation you have open as Markdown or JSON, with speaker labels and available metadata. HaulOut runs in your browser and downloads the result. Nothing is uploaded.

[Install userscript](/haulout.user.js) · [View a sample haul](/example.md) · [Compatibility](/spec#compatibility)

## Install (supported path)

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
- **Per-turn clocks** when the site stores them. Missing clocks are omitted, not invented
- **`exported_at`** so two hauls of the same URL can be compared
- **`source`:** `api` (conversation endpoint) or `dom` (rendered turns after scroll)

JSON is the same fields plus a `turns` array. [Sample JSON](/example.json). Images and uploads are referenced, not zipped.

## How you know it finished

The button shows `{n} turns · API|DOM · MD|JSON`. `n` is what HaulOut collected. It is not a certificate that the provider stored exactly that many turns. Empty extract fails with an error. A long thread is scrolled first so lazy turns can appear. That walk has a step cap. Public copy does not promise every turn of every conversation.

## Compatibility

Live page checks were **not recently checked** on 2026-09-10. The table lives in [`docs/COMPATIBILITY.md`](https://github.com/Catalyst-Forge-LLC/haulout/blob/main/docs/COMPATIBILITY.md). No platform is marked passed without a recorded check.

ChatGPT, Claude, and grok.com are API-first in code. Gemini and SuperGrok (`x.com/i/grok`) are DOM-first. SuperGrok uses hashed classes and will break first.

## Advanced fallbacks

These are not as reliable as Tampermonkey.

- **Violentmonkey / Greasemonkey:** plausible, not recently checked.
- **Bookmarklet:** drag from [`fallback/`](https://github.com/Catalyst-Forge-LLC/haulout/tree/main/fallback). Claude often blocks `javascript:`.
- **Console:** paste [`haulout.js`](https://github.com/Catalyst-Forge-LLC/haulout/blob/main/fallback/haulout.js).

## Privacy

No HaulOut backend. Same-origin requests only. `@grant` is `GM_info`. You can read the script.

## Limits

Not a full-account archive. Official bulk exports still exist and are better for everything you ever said. Selectors rot. Binaries are not bundled.

## Family

> Haul out the thread. Then detangle it.

[Detangler](https://detangler.dev) is the next tool, not a HaulOut mode.

## Legal

HaulOut is an unofficial local tool. It is not affiliated with OpenAI, Anthropic, Google, xAI, or X. Private web APIs and page structure change. Hauls can be incomplete. You are responsible for how you keep and share your own transcripts.

MIT · [GitHub](https://github.com/Catalyst-Forge-LLC/haulout) · [Spec](/spec)
