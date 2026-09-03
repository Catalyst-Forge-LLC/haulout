There is no Tampermonkey “App Store.” Tampermonkey just installs whatever `.user.js` URL you hand it. The directory that actually feeds TM/Violentmonkey/ScriptCat is **Greasy Fork**.

**Where to put it**

| Place | Role |
|---|---|
| **GitHub** (`you/haulout`) | Source of truth. Issues, SPEC, raw file. |
| **Greasy Fork** | Public install button. This is the “directory.” |
| **haulout.dev** | One-pager that points at both. |
| OpenUserJS | Optional, smaller, skip unless you want belt-and-suspenders. |
| Chrome Web Store | Different product (a packaged extension). Do not start there. |

**Publish on Greasy Fork**

1. Put the repo up. File must be named `haulout.user.js` and start with `==UserScript==`.
2. Create an account at [greasyfork.org](https://greasyfork.org).
3. New script → paste the file (or “sync from GitHub” / webhook so updates are not copy-paste).
4. License is required and must be open. MIT matches the spec.
5. Description: the short + long blurb already in SPEC §12.
6. Wait for review (often same day). They reject closed source, obfuscation, remote payload, and “this script phones home.”

Add these headers before you submit so installs and updates work:

```js
// @license      MIT
// @homepageURL  https://haulout.dev
// @supportURL   https://github.com/<you>/haulout/issues
// @downloadURL  https://update.greasyfork.org/scripts/<id>/HaulOut.user.js
// @updateURL    https://update.greasyfork.org/scripts/<id>/HaulOut.user.js
```

Greasy Fork *overwrites* `@updateURL` / `@downloadURL` on their hosted copy. That is expected. Keep GitHub as the place you edit; GF as the place people click Install. Bump `@version` on every real change or managers will not pull updates.

**What will get you through review**

- `@grant` stays tiny (`GM_info` only).
- No analytics, no third-party `fetch`, no `@require` of a random CDN.
- Description says **local download of the conversation you already have open**, unofficial, selectors rot.
- Do not market it as “bypass” or “scrape everyone’s chats.”

**What I would ship first, in order**

1. GitHub public, MIT, `haulout.user.js` + SPEC + README.
2. Greasy Fork listing with the install button.
3. `haulout.dev` hero CTA = that Greasy Fork install URL.
4. Then tell people. A 20-line Show HN / a Grok or ChatGPT export-complaint thread will do more than a second directory.

Chrome Web Store comes later only if you want a toolbar icon and to escape the “Allow user scripts” mess you just hit. That is weeks of review and a different binary. Greasy Fork is the path that matches the thing you already have.