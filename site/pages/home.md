---
title: Haul out the thread.
description: Pull the open ChatGPT, Claude, Gemini, Grok, or SuperGrok conversation off the site as Markdown or JSON. Local only.
order: 0
---

Pull the open conversation off ChatGPT, Claude, Gemini, Grok, and SuperGrok as Markdown or JSON. Speakers, clocks when the site has them, title and project, export timestamp. Nothing is uploaded.

[Install userscript](/haulout.user.js) · [View a sample haul](/example.md)

Tampermonkey / Violentmonkey / Greasemonkey. Local only. Greasy Fork listing next.

## How

1. Open the conversation.
2. Click **Haul out** (or Alt+Shift+E).
3. Pick Markdown or JSON. The file lands in Downloads.

Long chats load turns on demand. HaulOut walks the thread before it reads.

## Platforms

ChatGPT · Claude · Gemini · Grok · SuperGrok (`x.com/i/grok`)

## Install

- **Userscript (supported path):** install [Tampermonkey](https://www.tampermonkey.net/), then open [`haulout.user.js`](/haulout.user.js) and accept the install.
- **Bookmarklet:** people who refuse userscripts can drag from the fallback page in the repo. Claude often blocks `javascript:` bookmarks.
- **Console:** paste [`haulout.js`](https://github.com/Catalyst-Forge-LLC/haulout/blob/main/fallback/haulout.js).

Reload the chat tab. The button sits at the bottom right.

## Privacy

No HaulOut backend. Same-origin requests only. `@grant` is `GM_info`. You can read the script; it is short on purpose.

## Limits

Not a full-account archive. Gemini and Grok-on-X are DOM-first. Selectors rot. Binaries are not bundled.

Official bulk exports still exist and are better for “everything I ever said.”

## Family

> Haul out the thread. Then detangle it.

[Detangler](https://detangler.dev) is the next tool, not a HaulOut mode.

## Legal

HaulOut is an unofficial local tool. It is not affiliated with OpenAI, Anthropic, Google, xAI, or X. Private web APIs and page structure change. Hauls can be incomplete. You are responsible for how you keep and share your own transcripts.

MIT · [GitHub](https://github.com/Catalyst-Forge-LLC/haulout) · [Spec](/spec)
