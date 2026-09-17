# Compatibility snapshot

Single source for public compatibility copy. Populate only observed checks. A platform does not get a passed status without a recorded check.

Checked revision: HaulOut `1.1.3` (`haulout.user.js`). Snapshot date: 2026-09-10.

This pass did not re-run live exports against provider pages. Adapter code and a sanitized ChatGPT fixture exist. Live UI checks are **not recently checked**.

| Platform | Hosts | Extract path | Last live check | Browser / manager | Modes exercised | Long-thread walk | Known limits |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ChatGPT | chatgpt.com, chat.openai.com | API first, DOM fallback | not recently checked | unknown | Markdown fixture dated 2026-09-02 (`source: api`) | implemented, not recently exercised | Open conversation only. Per-turn clocks when the API has them |
| Claude | claude.ai | API first, DOM fallback | not recently checked | unknown | none recorded | implemented, not recently exercised | `javascript:` bookmarklets are often blocked. Userscript is the supported path |
| Gemini | gemini.google.com | DOM after scroll | not recently checked | unknown | none recorded | implemented, not recently exercised | DOM-first. Selectors rot |
| Grok | grok.com | API first, DOM fallback | not recently checked | unknown | none recorded | implemented, not recently exercised | Open conversation only |
| SuperGrok | x.com/i/grok, twitter.com/i/grok | DOM after scroll | not recently checked | unknown | none recorded | implemented, not recently exercised | Hashed classes. Most brittle. 1.1.4 injects on x.com/* so SPA nav from the timeline shows the control; button still only on Grok routes |

**Supported install:** [Tampermonkey](https://www.tampermonkey.net/) plus [haulout.user.js](https://haulout.dev/haulout.user.js). Violentmonkey and Greasemonkey are plausible and not recently checked. Bookmarklet and console paste are fallbacks with known host blocks.

**What a finished haul reports:** a toast `{n} turns · API|DOM · MD|JSON`. `n` is the turns HaulOut collected, not a proof that the provider stored exactly that many. API means the site conversation endpoint returned a non-empty `turns` array. DOM means the rendered thread after the scroll walk. Empty extract fails with an error. Images and uploads are referenced, not bundled.
