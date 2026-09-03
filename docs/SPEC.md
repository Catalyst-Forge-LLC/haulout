# HaulOut — Product & Implementation Spec

Version: 0.1  
 Date: 2026-09-02  
 Status: freeze the name; ship v1 from the existing userscript  
 Canonical site: https://haulout.dev  
 Sibling tool: Detangler (structural edit of the hauled-out file)

This document is the source of truth for brand, behavior, repo copy, and the first haulout.dev page. Implementation lives at repo-root `haulout.user.js`.

---

## 1. Frozen strings

Do not reopen naming. These three strings are the product:

1. **HaulOut** — product, GitHub, npm, `<title>`
2. **Haul out** — button, heading verb, spoken command
3. **Haul out the thread. Then detangle it.** — family sentence with Detangler

Also frozen:

| Use | String |
|---|---|
| Domain | `haulout.dev` |
| One-line | HaulOut pulls the open conversation off ChatGPT, Claude, Gemini, Grok, and SuperGrok as Markdown or JSON. |
| GitHub description (350 char cap, keep short) | Pull the open AI chat off the site as Markdown or JSON. Speakers, clocks, title, export timestamp. Local only. |
| Userscript name | HaulOut |
| Userscript namespace | `dev.haulout` |
| Button title / tooltip | Haul out this conversation (Alt+Shift+E) |
| Keyboard | Alt+Shift+E |
| CLI binary (later) | `haulout` |
| Filename stem | `haulout-YYYY-MM-DD-<platform>-<slug>` |
| JSON `exporter` field | `haulout` |

Never ship: HaulOut AI, HaulOutEx, SuperHaul, ChatRescue, Offthread, Castoff (as this product), “castoffs,” Offing.

---

## 2. Metaphor

A **haul-out** is when a boat leaves the water and sits on your land. The conversation lives in their origin. HaulOut pulls it out and sets it on disk.

Own that picture. Do not drift into:

- rescue / ambulance / poisoned-thread recovery
- takeout / dump / omni-exporter
- discarded leftovers (“castoffs”)
- moving-truck “haul”

Visual: hull on straps, or a line coming up over a gunwale. One color. No life ring, no hanger, no shipping pallet.

Marinas already use “haul-out” for winter storage and bottom paint. The first sentence on every surface must say **conversation**, not keel.

---

## 3. Problem

None of the major AI chat sites offer a good “this conversation, right now, as Markdown or JSON I can read and diff later” control.

What they ship instead:

- whole-account dumps, delayed, ugly JSON (ChatGPT Data controls, Claude export, Grok `accounts.x.ai`, Gemini Takeout)
- PDF / Docs / share links
- nothing for the open SuperGrok thread on X

The UIs virtualize the message list. A naive DOM scrape silently drops turns that are not in the current window.

HaulOut is for **the open conversation**. Official bulk export remains the right tool for “everything I ever said.”

---

## 4. Product definition

### Is

- A Tampermonkey userscript (primary)
- Bookmarklet + console snippet (fallback)
- Later: `haulout.dev` install page and optional CLI that does not talk to a HaulOut server

Runs entirely in the user’s browser. Uses the page origin’s own cookies. Uploads nothing.

### Is not

- A bulk archive of every chat
- A cloud sync, account, or “workspace”
- A rewriter, summarizer, or doom-loop fixer
- An unofficial API proxy that leaves the machine
- Affiliated with OpenAI, Anthropic, Google, or xAI

### Success for v1

On a logged-in conversation page, one click (or Alt+Shift+E) produces a local `.md` or `.json` file that contains:

- every turn HaulOut can honestly get
- speaker labels
- title / project / conversation id when present
- per-turn timestamps when the site stores them
- `exported_at` / `exportedAt` so two hauls of the same URL can be compared
- `source`: `api` or `dom`

---

## 5. Supported surfaces (v1)

| Platform key | Hosts | Conversation hint | Preferred extract |
|---|---|---|---|
| `chatgpt` | chatgpt.com, chat.openai.com | `/c/<id>`, project `/g/…` | `GET /api/auth/session` + `GET /backend-api/conversation/<id>` |
| `claude` | claude.ai | `/chat/<uuid>`, project `/project/…` | `GET /api/organizations` + `GET /api/organizations/<org>/chat_conversations/<id>?tree=True&rendering_mode=messages` |
| `gemini` | gemini.google.com | `/app/…` | DOM after scroll (API later if a stable same-origin RPC is worth it) |
| `grok` | grok.com | `/c/<id>` | `GET /rest/app-chat/conversations_v2/<id>`, response-node, `POST …/load-responses` |
| `grok-x` | x.com/i/grok, twitter.com/i/grok | `?conversation=` | DOM after scroll (hashed classes; most brittle) |

Out of scope for v1: Perplexity, Copilot, DeepSeek, Poe, AI Studio standalone, shared-link pages the user is not logged into, mobile apps.

---

## 6. Runtime behavior

### 6.1 Inject

- `@run-at document-idle`, `@grant none`, `@noframes`
- Floating control, bottom-right, above typical composers (`bottom: 88px`)
- Host element id `haulout-fab` in a **shadow root** so site CSS cannot restyle it
- Re-attach on `pushState` / `replaceState` / `popstate` and a slow poll (SPA)
- On X, only while the path is `/i/grok*`

Button label: **Haul out**  
Hint line: `Alt+Shift+E`

### 6.2 On click

1. Confirm a known platform; if not, say so and stop.
2. Ask **Markdown** or **JSON** (Cancel exists).
3. **Hydrate:** find the tallest scrollable thread container. Sit at the top until height is stable (~3 samples), then walk down in ~65% viewport steps with ~260 ms pauses until the bottom is stable (~4 samples). Cap ~50 top steps / ~180 down steps so a broken scroller cannot run forever. Restore the user’s scroll position.
4. **API first** on ChatGPT, Claude, grok.com. If that yields a non-empty `turns` array, `source = api`.
5. Else **DOM** extract with platform selectors. `source = dom`.
6. Stamp metadata. Download. Toast: `{n} turns · API|DOM · MD|JSON`.

Never block the tab on a remote HaulOut host. `fetch` is same-origin only.

### 6.3 Honesty rules

- If a turn has no timestamp, omit it (JSON `null` / Markdown heading without an em-dash clock). Do not invent clocks.
- If the API is partial, still prefer it over a thinner DOM scrape, and leave `source: api`. If you later detect missing tails, add `sourceCompleteness: unverified` rather than silently padding from the DOM unless you explicitly merge and document the merge.
- Images: Markdown image syntax when a URL exists. Do not download binaries in v1.
- Thinking / tool blocks: include only if they are real message text. Prefer markers (`[Tool: …]`, `[Artifact: …]`) over dumping hidden chain-of-thought the UI did not show.

---

## 7. Output contract

### 7.1 Filename

```
haulout-YYYY-MM-DD-<platform>-<slug>.md
haulout-YYYY-MM-DD-<platform>-<slug>.json
```

- Date is the **haul** date (local file clock), ISO date portion of `exportedAt`
- `slug` from title, max 60, ASCII, hyphenated
- Platform keys as in §5

### 7.2 JSON shape

```json
{
  "exporter": "haulout",
  "exporterVersion": "1.1.0",
  "exportedAt": "2026-09-02T17:43:00.000Z",
  "platform": "chatgpt",
  "source": "api",
  "url": "https://chatgpt.com/c/…",
  "conversationId": "…",
  "title": "Kitchen reno punch list",
  "project": "House",
  "model": "gpt-5",
  "createdAt": "2026-08-30T14:10:00.000Z",
  "updatedAt": "2026-09-02T12:01:00.000Z",
  "organizationId": null,
  "scroll": {
    "container": "main#thread",
    "startHeight": 2400,
    "endHeight": 18120,
    "steps": 42
  },
  "turns": [
    {
      "index": 1,
      "id": "…",
      "role": "user",
      "speaker": "You",
      "timestamp": "2026-08-30T14:11:02.000Z",
      "model": null,
      "text": "Can we keep the existing range hood?"
    }
  ]
}
```

`role` is only `user` | `assistant`.  
`speaker` is `You` | `ChatGPT` | `Claude` | `Gemini` | `Grok`.

### 7.3 Markdown shape

YAML front matter first (for Obsidian / Detangler / git):

```yaml
---
exported_at: 2026-09-02T17:43:00.000Z
platform: chatgpt
source: api
url: https://chatgpt.com/c/…
title: Kitchen reno punch list
project: House
conversation_id: …
model: gpt-5
created_at: 2026-08-30T14:10:00.000Z
updated_at: 2026-09-02T12:01:00.000Z
turns: 18
exporter: haulout 1.1.0
---
```

Then a short header list and one heading per turn:

```markdown
### You · turn 1 — 2026-08-30T14:11:02.000Z

Can we keep the existing range hood?
```

DOM path should keep fenced code, tables, links, images, lists, emphasis.

---

## 8. Code map

| Path | Role |
|---|---|
| `haulout.user.js` | Tampermonkey userscript (repo-root for GitHub raw / Greasy Fork) |
| `fallback/haulout.js` | Console snippet |
| `fallback/haulout.bookmarklet.txt` | Bookmarklet URL |
| `fallback/install.html` | Old bookmarklet page; haulout.dev replaces it |
| `docs/SPEC.md` | This document |
| `examples/kitchen-reno.md` | Sample haul |
| `site/` | FilePress site for haulout.dev |
| Userscript `@name` | HaulOut |
| FAB id | `haulout-fab` |
| Overlay id | `haulout-ui` |
| Version | 1.1.2 |

Grant stays `none`. Same-origin `fetch` is the point.

---

## 9. Open-source posture

- License: MIT (default unless you have a reason to go GPL)
- Disclaimer: unofficial; site HTML and private endpoints change; HaulOut will break; that is expected
- Security: no telemetry, no remote script tag, no eval of site content as code
- Contributing: selectors and API adapters are the perishable layer; keep them isolated from Markdown/JSON rendering
- Issue templates worth having: `site-broke` (host, date, API vs DOM, screenshot of empty haul), `selector`, `want-platform`

Do not scrape other users’ shared links into a HaulOut server. There is no HaulOut server in v1.

---

## 10. haulout.dev — site spec

One page is enough for v1. Static. No account. No analytics required; if you add any, make it optional and off by default.

### 10.1 Jobs of the page

1. Say what it is in one sentence.
2. Install the userscript.
3. Show what a haul looks like.
4. State local-only clearly.
5. Point at Detangler without making this a Detangler ad.

### 10.2 Information architecture

```
haulout.dev                 marketing + install
haulout.dev/#install        same page anchor
haulout.dev/example.md      sample haul (static file)
haulout.dev/spec            this document, or link to GitHub SPEC.md
```

Optional later: `/changelog`, `/platforms` (selector freshness).

### 10.3 Page outline

**Hero**

- Wordmark: HaulOut
- H1: Haul out the thread.
- Sub: Pull the open conversation off ChatGPT, Claude, Gemini, Grok, and SuperGrok as Markdown or JSON. Speakers, clocks when the site has them, title and project, export timestamp. Nothing is uploaded.
- Primary CTA: Install userscript
- Secondary CTA: View a sample haul
- Fine print: Tampermonkey / Violentmonkey / Greasemonkey. Local only.

**How**

Three steps, no screenshots required on day one:

1. Open the conversation.
2. Click **Haul out** (or Alt+Shift+E).
3. Pick Markdown or JSON. The file lands in Downloads.

One line on the scroll pass: long chats load turns on demand; HaulOut walks the thread before it reads.

**Platforms**

Five names, not logos if legal is lazy. Note SuperGrok is `x.com/i/grok`.

**Install**

- Tampermonkey: “Raw” on `haulout.user.js` (GitHub) or a `/haulout.user.js` copy on the domain
- Bookmarklet drag target for people who refuse userscripts, with a CSP warning for Claude
- Console: paste `haulout.js`

**Privacy**

- No HaulOut backend
- Same-origin requests only
- `@grant none`
- You can read the script; it is short on purpose

**Limits**

- Not a full-account archive
- Gemini and Grok-on-X are DOM-first
- Selectors rot
- Binaries not bundled

**Family**

> Haul out the thread. Then detangle it.

One link to Detangler when that site exists. Until then, one sentence.

**Footer**

MIT · unofficial · not affiliated · GitHub · spec

### 10.4 Voice

Short. Imperative. No “powerful / seamless / effortlessly.” No emoji soup. No “AI-powered” — the product is a winch, not a model.

Good: “Haul out this conversation.”  
Bad: “Rescue your AI memories with one click.”

### 10.5 Visual

- Dark page, near-black (`#0b0b0c`) and zinc text, matching the in-page panel
- Accent: a single warm metal or rope color, not chatbot purple
- Wordmark is the word. Do not fake a hull logo until you have a real mark
- Monospace for filenames and front matter only

### 10.6 Meta / social

```
title: HaulOut — haul out the thread
description: Pull the open ChatGPT, Claude, Gemini, Grok, or SuperGrok conversation off the site as Markdown or JSON. Local only.
og:image: later; until then, wordmark on dark
```

### 10.7 Install mechanics

GitHub is the source of truth for the `.user.js`. The site may hotlink:

```
https://github.com/<you>/haulout/raw/main/haulout.user.js
```

Tampermonkey will install from a raw URL if the file starts with `==UserScript==`. Also host a copy on `haulout.dev/haulout.user.js` with `Content-Type: text/javascript` so a userscript manager can pick it up without GitHub’s HTML wrapper.

Add `@updateURL` and `@downloadURL` once the raw path is stable.

### 10.8 Legal blurb (footer)

> HaulOut is an unofficial local tool. It is not affiliated with OpenAI, Anthropic, Google, xAI, or X. Private web APIs and page structure change. Hauls can be incomplete. You are responsible for how you keep and share your own transcripts.

---

## 11. GitHub README (paste-ready)

Use this as `README.md` in the public repo. Keep SPEC.md in the repo too.

````markdown
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

## What you get

```text
haulout-2026-09-02-chatgpt-kitchen-reno.md
```

- YAML front matter (`exported_at`, `platform`, `source`, `url`, `title`, `project`, …)
- One heading per turn: `### You · turn 1 — 2026-08-30T14:11:02.000Z`
- JSON with the same fields and a `turns` array
- `source: api` when HaulOut read the site’s own conversation endpoint
- `source: dom` when it had to read the rendered thread after scrolling

## Why it scrolls

These UIs virtualize the thread. Only a window of turns exists in the DOM. HaulOut goes to the top, waits for older turns, then walks down before it reads. ChatGPT, Claude, and grok.com are API-first; the scroll pass is still a safety net. Gemini and Grok-on-X are DOM-first.

## Limits

- This is the **open** conversation, not a bulk account archive.
- Per-turn clocks are often missing from the page. API hauls are the ones with real timestamps.
- Images and uploads are referenced, not zipped.
- `x.com/i/grok` uses hashed classes and will break first.
- Official full-account exports still exist and are better for “everything I ever said.”

## License

MIT. Unofficial. Not affiliated with the chat sites.
````

---

## 12. Greasy Fork / description bits

**Short (one line)**  
Haul out the open ChatGPT, Claude, Gemini, Grok, or SuperGrok chat as Markdown or JSON.

**Long**  
HaulOut adds a Haul out button (Alt+Shift+E) on the major AI chat sites. It hydrates long virtualized threads, prefers each site’s same-origin conversation API when one exists, and downloads a dated Markdown or JSON file with speakers, title/project, and an export timestamp. Nothing is sent to a HaulOut server. `@grant` is `GM_info` only.

**Tags**  
chatgpt, claude, gemini, grok, markdown, json, export, userscript, local-first

---

## 13. Roadmap

**v1 — rename and publish**

- Apply frozen strings throughout the userscript
- Sample haul checked in as `examples/kitchen-reno.md`
- haulout.dev single page
- MIT LICENSE, this SPEC, README

**v1.1**

- Copy to clipboard as well as download
- Remember last format
- `sourceCompleteness` when API and DOM disagree

**v1.2**

- Gemini same-origin RPC if it stays cheaper than DOM
- Fewer false splits on Grok-on-X

**Explicitly later / maybe never**

- Bulk “all my chats” (point at official takeouts)
- Attachment zip
- Cloud folder sync
- Summarize-on-export (that is a different product)

---

## 14. Acceptance checks

A haul is good enough to ship when:

- [ ] ChatGPT logged-in thread, API path, timestamps present, title in the filename
- [ ] Claude project thread, project name in front matter
- [ ] grok.com thread, API or honest DOM fallback
- [ ] Gemini long thread: scroll actually increases captured turns vs no-scroll
- [ ] x.com/i/grok does not inject on ordinary tweets
- [ ] Two hauls of the same URL have different `exported_at` and comparable `turns`
- [ ] No request leaves the chat site origin besides the file download

---

## 15. Decisions already made

| Decision | Choice |
|---|---|
| Name | HaulOut |
| Domain | haulout.dev |
| Primary vehicle | Tampermonkey userscript |
| Formats | Markdown + JSON only in v1 |
| Scope | Current conversation |
| Telemetry | None |
| Brand family | Detangler is the next tool, not a HaulOut mode |
| Rejected names | ChatRescue, Offthread, Castoff, Offing, Unthread, Ripcord, Omni-exporter |

If a future name discussion starts, the answer is this section.
