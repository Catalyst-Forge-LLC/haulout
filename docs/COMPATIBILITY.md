# Compatibility

Single source for public compatibility copy. A site gets a "last checked working" date only from a recorded successful haul. There are no automated tests against the live sites.

Current userscript: HaulOut `1.1.4` (`haulout.user.js`). Record updated: 2026-09-22.

## Supported

These are the sites the userscript matches and has an adapter for. Supported means HaulOut is built for the site. It does not mean the site was checked recently.

| Site | Hosts | Extract path |
| --- | --- | --- |
| ChatGPT | chatgpt.com, chat.openai.com | Conversation API first, page fallback |
| Claude | claude.ai | Conversation API first, page fallback |
| Gemini | gemini.google.com | Page, after the scroll walk |
| Grok | grok.com | Conversation API first, page fallback |
| Grok on X (SuperGrok in the spec) | x.com/i/grok, twitter.com/i/grok | Page, after the scroll walk |

**Supported install:** [Tampermonkey](https://www.tampermonkey.net/) plus [haulout.user.js](https://haulout.dev/haulout.user.js). Violentmonkey and Greasemonkey are not verified. Bookmarklet and console paste are fallbacks with known host blocks.

## Last checked working

Each date is the `exported_at` timestamp (UTC) of the most recent successful maintainer haul on record, with the version from its `exporter` field. Browser and userscript manager were not recorded in the file.

| Site | Last checked working | Version | Source | Turns | Notes |
| --- | --- | --- | --- | --- | --- |
| ChatGPT (chatgpt.com) | 2026-09-21 | 1.1.4 | api | 12 | chat.openai.com not checked separately |
| Grok (grok.com) | 2026-09-21 | 1.1.4 | api | 58 | |
| Claude | 2026-09-09 | 1.1.3 | api | 26 | 1.1.4 changed only the X matching |
| Gemini | 2026-09-09 | 1.1.3 | dom | 111 | Haul made after the 1.1.3 duplicate-turn fix. Long-thread scroll walk exercised |
| Grok on X | not recently verified | | | | On 2026-09-17 the button appeared after a page refresh on 1.1.3. No completed haul is on record. The 1.1.4 fix for arriving from the X timeline is not yet confirmed on a live page |

The sample in `examples/kitchen-reno.md` is a sanitized fixture, not a compatibility check.

## Known limits

- Open conversation only. Per-turn timestamps appear only when the site provides them, which in practice means API hauls.
- Gemini and Grok on X read the rendered page. Page markup changes break them first. Grok on X uses generated class names and is the most brittle.
- Claude often blocks `javascript:` bookmarklets. The userscript is the supported path there.
- Since 1.1.4 the script loads on all of x.com and twitter.com so it survives in-app navigation. The button still appears only on Grok routes.

## What a finished haul reports

The HaulOut panel shows `{n} turns · API|DOM · MD|JSON`. `n` is the turns HaulOut collected, not proof that the provider stored exactly that many. API means the site conversation endpoint returned a non-empty `turns` array. DOM means the rendered thread after the scroll walk. An empty extract fails with an error. Images and uploads are referenced, not bundled.
