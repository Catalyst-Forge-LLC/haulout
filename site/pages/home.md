---
title: "Keep the chat as a file of your own."
description: "Save the AI conversation you have open as Markdown or JSON, with speaker labels and available metadata. HaulOut downloads a copy you can read, search, or keep with the project."
order: 0
---

<section class="value-hero" aria-label="HaulOut overview"><div class="value-intro"><div class="value-headline"><p class="value-kind">Browser userscript for exporting AI conversations</p><h1 class="hero-phrased"><span class="hero-phrase">Keep the chat</span> <span class="hero-phrase">as a file of your own.</span></h1></div><div class="value-pitch"><p class="value-lede">Save the AI conversation you have open as Markdown or JSON, with speaker labels and available metadata. HaulOut downloads a copy you can read, search, or keep with the project.</p><div class="cta-row"><a class="cta cta-primary" href="#install">Set up the userscript</a><a class="cta cta-secondary" href="#export-example">See the exported words</a></div><p class="value-limit">Requires Tampermonkey. Long threads can be incomplete. The export does not upload your transcript to a HaulOut service.</p></div></div>
<figure class="value-proof worked-example" id="export-example" tabindex="-1">
<figcaption>The conversation leaves the tab as readable Markdown</figcaption>
<p class="example-context">Excerpt from the existing sanitized ChatGPT API fixture, “Kitchen reno punch list.” It is a sample artifact, not an export from your account.</p>
<section class="example-step" aria-labelledby="example-step-1">
<h2 id="example-step-1"><span>1 · Conversation in the browser</span> Keep the question with its context</h2>
<blockquote><p>Can we keep the existing range hood?</p></blockquote><p>This is turn 1 of the sample conversation, in the <strong>House</strong> project.</p><p>Click <strong>Haul out</strong>, choose Markdown, and save the downloaded file with your project.</p>
</section>
<section class="example-step example-report" aria-labelledby="example-step-2">
<h2 id="example-step-2"><span>2 · Markdown export excerpt</span> Speaker, time, and source travel with the words</h2>
<pre><code>title: Kitchen reno punch list&#10;project: House&#10;exported_at: 2026-09-02T17:43:00.000Z&#10;source: api&#10;turns: 4&#10;&#10;### You · turn 1 — 2026-08-30T14:11:02.000Z&#10;&#10;Can we keep the existing range hood?</code></pre>
</section>
<section class="example-step" aria-labelledby="example-step-3">
<h2 id="example-step-3"><span>3 · Your saved file</span> Find the exchange after the tab is closed</h2>
<p>Open the Markdown in an editor or search the project for <strong>range hood</strong>. The complete export retains the replies and speaker labels, so the question is not separated from the discussion.</p><p class="example-payoff">You can keep the conversation in the same folder and history as the work it informed.</p>
</section>
<p class="value-note">Selected metadata and one turn are shown here. Collection counts do not prove completeness. Attachments are referenced, not bundled.</p>
<p class="example-links"><a href="/example.md" data-sveltekit-reload>Open the complete Markdown export</a> · <a href="/example.json" data-sveltekit-reload>Inspect the JSON version</a></p>
</figure></section>

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open <a href="/haulout.user.js" download="haulout.user.js" data-sveltekit-reload>haulout.user.js</a> and accept the install.
3. Reload the chat tab.
4. Open the conversation you want.
5. Click **Haul out** at the bottom right, or press **Alt+Shift+E**.
6. Pick Markdown or JSON. The file lands in Downloads.

That is the path this project supports. Claude often blocks `javascript:` bookmarklets. The userscript is the one that works there.

## What a haul contains

The <a href="/example.md" data-sveltekit-reload>sample Markdown</a> is a sanitized ChatGPT API fixture, not an account archive.

- **Speakers:** `You` and `ChatGPT` (or the host label)
- **Title and project** when the page has them
- **Per-turn timestamps** when the site stores them. Missing timestamps are left out, not invented
- **`exported_at`** so two hauls of the same URL can be compared
- **`source`:** `api` (conversation endpoint) or `dom` (rendered turns after scroll)

JSON is the same fields plus a `turns` array. <a href="/example.json" data-sveltekit-reload>Sample JSON</a>. Images and uploads are referenced, not zipped.

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

Claude and Gemini were last hauled on 1.1.3. Version 1.1.4 only changed how Grok on X is detected, and that path does not have a completed haul on record yet.

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
