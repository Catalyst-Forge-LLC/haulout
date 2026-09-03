# Greasy Fork — listing pack

The public install door people click. GitHub stays the edit place. haulout.dev hosts the live `.user.js` (and is the sync URL until the GitHub repo is public).

New script: https://greasyfork.org/en/script_versions/new  
(Sign in first. GitHub OAuth is fine.)

---

## Form fields (paste)

**Name**  
HaulOut

**Sync type**  
Sync from URL (not a one-off paste). Then “Update and sync now.”

**Sync / source URL**  
```
https://haulout.dev/haulout.user.js
```

Do not use the GitHub raw URL while the repo is private — it 404s.

**Language**  
JavaScript

**License**  
MIT (also in the file as `@license MIT`)

**Adult content**  
No

**Short description** (one line; also in the userscript `@description`)  
Haul out the open ChatGPT, Claude, Gemini, Grok, or SuperGrok chat as Markdown or JSON.

**Additional info** (markdown)

```markdown
**Haul out the thread.**

HaulOut adds a **Haul out** button (Alt+Shift+E) on ChatGPT, Claude, Gemini, grok.com, and SuperGrok (`x.com/i/grok`). It walks long virtualized threads, prefers each site’s same-origin conversation API when one exists, and downloads a dated Markdown or JSON file with speakers, title/project, and an export timestamp.

Nothing is sent to a HaulOut server. `@grant` is `GM_info` only. Unofficial. Selectors and private endpoints change; hauls can be incomplete.

This is the **open** conversation, not a bulk account archive.

- Site: https://haulout.dev
- Sample haul: https://haulout.dev/example.md
- Spec: https://haulout.dev/spec
```

**Tags**  
chatgpt, claude, gemini, grok, markdown, json, export, userscript, local-first

**Category** (if asked)  
Productivity / Chat. Not Ads, not “bypass.”

---

## After they give you a script id

Greasy Fork overwrites `@updateURL` / `@downloadURL` on **their** hosted copy. Leave our file pointed at haulout.dev.

Then:

1. Paste the listing URL here (shape: `https://greasyfork.org/en/scripts/<id>-haulout`).
2. We switch the haulout.dev hero CTA to that Install button.
3. Optional later: make the GitHub repo public and move sync to  
   `https://raw.githubusercontent.com/Catalyst-Forge-LLC/haulout/main/haulout.user.js`  
   plus the account webhook on https://greasyfork.org/en/users/webhook-info

Bump `@version` on every real userscript change or managers will not pull updates.

---

## Review notes (do not put in the listing)

- No analytics, no third-party `fetch`, no `@require` of a CDN.
- Same-origin requests only. Description says **local download of the conversation you already have open**.
- Do not market it as “bypass” or “scrape everyone’s chats.”
- OpenUserJS and Chrome Web Store stay later.
