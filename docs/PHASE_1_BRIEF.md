# HaulOut — Phase 1 architecture brief

_Structured capture of planning and architecture **before** code scaffolding. Ingested from the frozen product spec in `docs/SPEC.md`._

**Status:** `locked`  
**Last updated:** `2026-09-03`  
**Phase 1 exit:** Brief locked from SPEC. Site spine started in the same kickoff because the user asked to set up FilePress, LocalSlip, and LocalHelm.

---

## 1. Problem and outcome

**What we are building (2–4 sentences):**

None of the major AI chat sites offer a good “this conversation, right now, as Markdown or JSON I can read and diff later” control. They ship delayed whole-account dumps, PDFs, or share links. The UIs virtualize the message list, so a naive scrape silently drops turns. **HaulOut** is a Tampermonkey userscript (plus bookmarklet/console fallback) that hydrates the open thread, prefers each site’s same-origin conversation API, and downloads a dated local file. Nothing is uploaded.

**Project archetype:** `product`

**What “done” looks like for v1 (measurable where possible):**

On a logged-in conversation page, one click (or Alt+Shift+E) produces a local `.md` or `.json` that contains every turn HaulOut can honestly get, speaker labels, title/project/id when present, per-turn timestamps when the site stores them, `exportedAt`, and `source: api|dom`. haulout.dev is a one-page install site. Frozen strings from SPEC §1 are applied throughout.

---

## 2. Users and hero flow

**Primary user(s):**

People who keep working notes from ChatGPT, Claude, Gemini, Grok, or SuperGrok and want the **open** thread on disk — not a bulk archive.

**The single most important workflow (hero flow) end-to-end:**

Open a logged-in conversation → click **Haul out** (or Alt+Shift+E) → pick Markdown or JSON → file lands in Downloads with speakers, metadata, and `exportedAt`.

**Secondary workflows (if any) for v1:**

- Install from GitHub raw / haulout.dev `/haulout.user.js` / later Greasy Fork
- Bookmarklet / console fallback (`fallback/`)
- View a sample haul on the site

---

## 3. Constraints

- **Technical:** Local-only. Same-origin `fetch` only. `@grant` stays tiny (`GM_info`). No HaulOut backend, no telemetry, no remote script tag. Userscript is the primary vehicle. Site is static FilePress.
- **Business / timeline:** Rename and publish from the existing working userscript. Domain `haulout.dev`. Sibling: Detangler.
- **Explicit non-goals for v1:** See §10.

---

## 4. Stack and tooling

| Area            | Choice                                      | Status    | Notes / WHY |
| --------------- | ------------------------------------------- | --------- | ----------- |
| Product runtime | Tampermonkey userscript (`haulout.user.js`) | confirmed | Primary vehicle; GitHub raw is source of truth |
| Fallback        | Bookmarklet + console snippet in `fallback/` | confirmed | Claude blocks `javascript:` bookmarks |
| Site            | FilePress (`getfilepress`) in `site/`       | confirmed | Standard stack; static; no account |
| Language        | JavaScript (userscript); TypeScript for site scripts | confirmed | Userscript stays a single file for install |
| DB / backend    | None                                        | confirmed | Local-only; state does not outlive the download |
| Auth / storage  | None / browser download                     | confirmed | Page-origin cookies only |
| Styling         | Dark `#0b0b0c`, zinc text, one warm metal accent | confirmed | SPEC §10.5; match in-page panel |
| Deploy / CI     | Cloudflare Pages (`wrangler pages deploy`)  | confirmed | Sibling pattern; project name `haulout` |
| Package manager | pnpm                                        | confirmed | House standard |
| Local ports     | LocalSlip lease `haulout-site` on **5198**  | confirmed | Standard stack |
| Fleet           | LocalHelm enroll `haulout`                  | confirmed | Standard stack |
| Process         | ForgeTrail (`.forgetrail/`)                 | confirmed | Standard stack |

**State persistence:** no. Every haul is a local file. Site is static. No PocketBase, no auth.

---

## 5. Data model (sketch)

**Core entities:**

- **Haul** — one export of one open conversation. Filename `haulout-YYYY-MM-DD-<platform>-<slug>.{md,json}`.
- **Turn** — `index`, `id?`, `role` (`user` \| `assistant`), `speaker`, `timestamp?`, `model?`, `text`.
- **Platform** — `chatgpt` \| `claude` \| `gemini` \| `grok` \| `grok-x`.

**Relationships:** one haul has many turns. Platform adapters produce the same haul shape.

**Existing data / migration:** working userscript already in-repo (renamed from `ai-chat-export.user.js`). No user data to migrate.

---

## 6. Integrations and external systems

| Integration | Purpose | Auth / secrets | Risk notes |
| ----------- | ------- | -------------- | ---------- |
| ChatGPT / Claude / grok.com same-origin APIs | Preferred extract | Host session cookies | Endpoints change; unofficial |
| DOM selectors (all five, required for Gemini + grok-x) | Fallback extract | none | Selectors rot; x.com hashed classes first |
| Greasy Fork (later) | Public install button | none | Review rejects remote payload / phone-home |
| Cloudflare Pages | haulout.dev | wrangler login | Static only |
| Detangler | Sibling, not a mode | none | Link when that site exists |

No LLM in v1. Skip §6a.

---

## 7. Hardest problems and risks

1. Host UIs and unofficial APIs change; Gemini and Grok-on-X are DOM-first and brittle.
2. Virtualized threads silently drop turns if the scroll pass is wrong.
3. Honesty: do not invent timestamps; do not silently pad API hauls from the DOM.
4. Install friction (userscript managers, Claude CSP vs bookmarklet).

---

## 8. Architectural decisions (numbered)

**D1.** Name is HaulOut / haul out / “Haul out the thread. Then detangle it.” WHY: frozen in SPEC §1. Rejected: ChatRescue, Offthread, Castoff, Offing, Unthread, Ripcord, Omni-exporter.

**D2.** Primary vehicle is a Tampermonkey userscript, not an extension or server. WHY: runs in the page origin; no backend. Chrome Web Store is later if ever.

**D3.** Formats are Markdown + JSON only. WHY: readable and diffable; YAML front matter for Obsidian / Detangler / git.

**D4.** Scope is the **open** conversation. WHY: official takeouts already cover “everything I ever said.”

**D5.** No telemetry, no HaulOut host, `@grant` tiny. WHY: Greasy Fork review + product promise.

**D6.** Site is FilePress static on haulout.dev. WHY: house stack; one page is enough for v1.

**D7.** Userscript stays at repo-root `haulout.user.js` for GitHub raw + Greasy Fork. Fallbacks live in `fallback/`. Spec and notes in `docs/`. WHY: install URLs must stay stable; root was messy.

**D8.** Detangler is the next tool, not a HaulOut mode.

---

## 9. Open questions (before or during Phase 2)

| # | Question | Owner / resolve by |
| - | -------- | ------------------ |
| 1 | Greasy Fork listing now vs after first public tag | user |
| 2 | Cloudflare Pages project `haulout` already created? | user |
| 3 | Sample haul: keep the kitchen-reno sketch or replace with a real haul | user |

---

## 10. Explicitly out of scope (v1)

- Bulk “all my chats”
- Attachment zip
- Cloud folder sync
- Summarize-on-export
- Accounts, workspace, analytics (unless optional and off by default)
- Perplexity, Copilot, DeepSeek, Poe, AI Studio, shared-link pages the user is not logged into, mobile apps
- PocketBase / auth
- Invented timestamps

---

## 11. First feature batch (post-scaffold)

1. haulout.dev one-pager (hero, how, platforms, install, privacy, limits, family)
2. Host `/haulout.user.js` and `/example.md` from the site
3. Finish userscript honesty pass vs SPEC §6–7 if any leftover old strings remain
4. Acceptance checks in SPEC §14
5. Greasy Fork listing when asked

---

## 12. Handoff checklist (before leaving Phase 1)

- [x] User confirmed stack (ForgeTrail, LocalSlip, LocalHelm, FilePress) and domain
- [x] This brief is **locked** from `docs/SPEC.md`
- [x] `.forgetrail/workflow_tracking.json` has `decisions[]` for D1–D8
- [ ] User confirms Phase 1 complete so tracking can advance
