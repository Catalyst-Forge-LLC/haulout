/**
 * AI Chat Exporter 1.0.0
 * Bookmarklet / console snippet for the current conversation on:
 *   chatgpt.com, claude.ai, gemini.google.com, grok.com, x.com/i/grok
 *
 * Prefers each site's same-origin conversation API (complete history + timestamps).
 * Always hydrates the visible thread by scrolling to the top, then slowly down,
 * and uses the DOM as a fallback when the API is unavailable.
 *
 * Usage:
 *   1. Open a conversation.
 *   2. Click the bookmarklet, or paste this file into DevTools → Console.
 *   3. Choose Markdown or JSON. The file downloads locally. Nothing is uploaded.
 */
(async function AIChatExport() {
  const VERSION = "1.0.0";
  const exportedAt = new Date().toISOString();

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const host = location.hostname.replace(/^www\./, "");
  const path = location.pathname || "";
  const href = location.href;

  const platform =
    host.includes("chatgpt.com") || host.includes("chat.openai.com") ? "chatgpt" :
    host.includes("claude.ai") ? "claude" :
    host.includes("gemini.google.com") ? "gemini" :
    host.includes("grok.com") ? "grok" :
    (host === "x.com" || host === "twitter.com") && /\/i\/grok/.test(path + location.search) ? "grok-x" :
    null;

  if (!platform) {
    alert("Open a conversation on ChatGPT, Claude, Gemini, grok.com, or x.com/i/grok first.");
    return;
  }

  const ui = makeUI();
  ui.status("Preparing export…");

  try {
    const format = await ui.chooseFormat();
    if (!format) { ui.remove(); return; }

    ui.status("Scrolling the thread so lazy-loaded turns appear…");
    const scrollMeta = await hydrateByScrolling();

    ui.status("Trying the site’s conversation API…");
    let convo = null;
    let source = "dom";
    try {
      convo = await fetchViaApi(platform);
      if (convo && convo.turns && convo.turns.length) source = "api";
    } catch (err) {
      console.warn("[AIChatExport] API path failed:", err);
    }

    if (!convo || !convo.turns || !convo.turns.length) {
      ui.status("API unavailable — reading the rendered thread…");
      convo = extractViaDom(platform);
      source = "dom";
    }

    if (!convo || !convo.turns || !convo.turns.length) {
      throw new Error("No messages found. Scroll the conversation into view and try again. Selectors may have changed.");
    }

    convo.exporter = "ai-chat-export";
    convo.exporterVersion = VERSION;
    convo.exportedAt = exportedAt;
    convo.platform = platform;
    convo.source = source;
    convo.url = href;
    convo.scroll = scrollMeta;
    if (!convo.title) convo.title = guessTitle(platform);

    const stamp = exportedAt.replace(/[:.]/g, "-");
    const slug = slugify(convo.title || platform).slice(0, 60) || "conversation";
    const base = `${stamp.slice(0, 10)}-${platform}-${slug}`;

    if (format === "json") {
      download(`${base}.json`, JSON.stringify(convo, null, 2), "application/json");
    } else {
      download(`${base}.md`, toMarkdown(convo), "text/markdown;charset=utf-8");
    }

    ui.done(`${convo.turns.length} turns · ${source.toUpperCase()} · ${format.toUpperCase()}`);
  } catch (err) {
    console.error(err);
    ui.fail(err && err.message ? err.message : String(err));
  }

  /* ------------------------------------------------------------------ */
  /* UI                                                                  */
  /* ------------------------------------------------------------------ */
  function makeUI() {
    const existing = document.getElementById("ai-chat-export-ui");
    if (existing) existing.remove();
    const box = document.createElement("div");
    box.id = "ai-chat-export-ui";
    box.setAttribute("style", [
      "position:fixed", "z-index:2147483647", "top:16px", "right:16px",
      "width:320px", "font:13px/1.4 -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "background:#111", "color:#f4f4f5", "border:1px solid #3f3f46",
      "border-radius:12px", "padding:14px 14px 12px", "box-shadow:0 12px 40px rgba(0,0,0,.45)"
    ].join(";"));
    box.innerHTML = `
      <div style="font-weight:650;margin-bottom:6px">Export conversation</div>
      <div id="ace-status" style="color:#a1a1aa;margin-bottom:10px">…</div>
      <div id="ace-actions" style="display:flex;gap:8px;flex-wrap:wrap"></div>
    `;
    document.documentElement.appendChild(box);
    const statusEl = box.querySelector("#ace-status");
    const actions = box.querySelector("#ace-actions");
    return {
      status(t) { statusEl.textContent = t; },
      chooseFormat() {
        return new Promise((resolve) => {
          statusEl.textContent = "Export the current conversation as:";
          actions.innerHTML = "";
          [["md", "Markdown"], ["json", "JSON"], [null, "Cancel"]].forEach(([val, label]) => {
            const b = document.createElement("button");
            b.textContent = label;
            b.setAttribute("style",
              "cursor:pointer;border:0;border-radius:8px;padding:7px 10px;font:inherit;font-weight:600;" +
              (val ? "background:#fafafa;color:#111" : "background:#27272a;color:#e4e4e7"));
            b.onclick = () => { actions.innerHTML = ""; resolve(val); };
            actions.appendChild(b);
          });
        });
      },
      done(t) {
        statusEl.textContent = "Saved · " + t;
        setTimeout(() => box.remove(), 3500);
      },
      fail(t) {
        statusEl.textContent = "Failed · " + t;
        actions.innerHTML = "";
        const b = document.createElement("button");
        b.textContent = "Dismiss";
        b.setAttribute("style", "cursor:pointer;border:0;border-radius:8px;padding:7px 10px;font:inherit;background:#27272a;color:#e4e4e7");
        b.onclick = () => box.remove();
        actions.appendChild(b);
      },
      remove() { box.remove(); }
    };
  }

  /* ------------------------------------------------------------------ */
  /* Scroll hydrator                                                     */
  /* ------------------------------------------------------------------ */
  function findScrollRoot() {
    const hints = [
      "#thread",
      "[data-testid='conversation-panel']",
      "#chat-history",
      "infinite-scroller",
      "main",
      "[role='main']",
      "#last-reply-container",
      "div[class*='overflow-y']"
    ];
    const seen = new Set();
    const nodes = [];
    hints.forEach((sel) => {
      document.querySelectorAll(sel).forEach((n) => {
        if (!seen.has(n)) { seen.add(n); nodes.push(n); }
      });
    });
    document.querySelectorAll("div,main,section").forEach((n) => {
      const s = getComputedStyle(n);
      if ((s.overflowY === "auto" || s.overflowY === "scroll") && n.scrollHeight > n.clientHeight + 80) {
        if (!seen.has(n)) { seen.add(n); nodes.push(n); }
      }
    });
    nodes.sort((a, b) => (b.scrollHeight - b.clientHeight) - (a.scrollHeight - a.clientHeight));
    return nodes[0] || document.scrollingElement || document.documentElement;
  }

  async function hydrateByScrolling() {
    const root = findScrollRoot();
    const startH = root.scrollHeight;
    const orig = root.scrollTop;

    // Pull older turns by sitting at the top (virtualized lists load on scroll).
    let topStable = 0;
    let lastTopH = -1;
    for (let i = 0; i < 50 && topStable < 3; i++) {
      root.scrollTop = 0;
      window.scrollTo(0, 0);
      await sleep(220);
      const h = root.scrollHeight;
      if (h === lastTopH && root.scrollTop <= 2) topStable++;
      else topStable = 0;
      lastTopH = h;
    }

    // Walk down so every viewport-bound turn is realized.
    let downStable = 0;
    let lastH = root.scrollHeight;
    let steps = 0;
    while (steps < 180 && downStable < 4) {
      const step = Math.max(Math.floor(root.clientHeight * 0.65), 360);
      root.scrollTop = Math.min(root.scrollTop + step, root.scrollHeight);
      if (root === document.scrollingElement || root === document.documentElement) {
        window.scrollBy(0, step);
      }
      await sleep(260);
      const h = root.scrollHeight;
      const atBottom = root.scrollTop + root.clientHeight >= h - 8;
      if (h === lastH && atBottom) downStable++;
      else downStable = 0;
      lastH = h;
      steps++;
    }

    // Leave the view near the bottom (where people usually are).
    root.scrollTop = orig;
    return {
      container: describe(root),
      startHeight: startH,
      endHeight: root.scrollHeight,
      steps
    };
  }

  function describe(el) {
    if (!el || !el.tagName) return "document";
    return el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") +
      (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "");
  }

  /* ------------------------------------------------------------------ */
  /* API extractors                                                      */
  /* ------------------------------------------------------------------ */
  async function fetchViaApi(p) {
    if (p === "chatgpt") return fetchChatGPT();
    if (p === "claude") return fetchClaude();
    if (p === "grok") return fetchGrok();
    return null;
  }

  async function jget(url, headers) {
    const res = await fetch(url, { credentials: "include", headers: headers || { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.status + " " + url);
    return res.json();
  }

  async function jpost(url, body, headers) {
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: Object.assign({ Accept: "application/json", "Content-Type": "application/json" }, headers || {}),
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(res.status + " " + url);
    return res.json();
  }

  async function fetchChatGPT() {
    const id = (path.match(/\/c\/([a-zA-Z0-9-]+)/) || [])[1];
    if (!id) return null;
    const session = await jget("/api/auth/session");
    const token = session && session.accessToken;
    if (!token) throw new Error("ChatGPT session token missing");
    const data = await jget("/backend-api/conversation/" + id, {
      Accept: "application/json",
      Authorization: "Bearer " + token
    });
    const mapping = data.mapping || {};
    const turns = [];
    const seen = new Set();
    let node = data.current_node;
    const chain = [];
    while (node && mapping[node] && !seen.has(node)) {
      seen.add(node);
      chain.push(mapping[node]);
      node = mapping[node].parent;
    }
    chain.reverse();
    chain.forEach((n) => {
      const m = n.message;
      if (!m) return;
      const role = m.author && m.author.role;
      if (role !== "user" && role !== "assistant") return;
      const text = chatgptContent(m);
      if (!text) return;
      turns.push({
        id: m.id,
        role,
        speaker: role === "user" ? "You" : "ChatGPT",
        timestamp: isoFromUnix(m.create_time),
        model: m.metadata && (m.metadata.model_slug || m.metadata.default_model_slug),
        text
      });
    });
    const project = guessChatGPTProject();
    return {
      conversationId: data.conversation_id || id,
      title: data.title || guessTitle("chatgpt"),
      project,
      model: data.default_model_slug,
      createdAt: isoFromUnix(data.create_time),
      updatedAt: isoFromUnix(data.update_time),
      turns
    };
  }

  function chatgptContent(m) {
    const c = m.content;
    if (!c) return "";
    if (typeof c === "string") return c.trim();
    const parts = [];
    const add = (x) => { if (x && String(x).trim()) parts.push(String(x).trim()); };
    if (Array.isArray(c.parts)) {
      c.parts.forEach((p) => {
        if (typeof p === "string") add(p);
        else if (p && typeof p.text === "string") add(p.text);
        else if (p && p.content_type === "audio_transcription" && p.text) add(p.text);
      });
    } else if (typeof c.text === "string") add(c.text);
    return parts.join("\n\n").trim();
  }

  function guessChatGPTProject() {
    const m = path.match(/\/g\/g-p-([a-zA-Z0-9]+)(?:-([^/]+))?/);
    if (m) return decodeURIComponent((m[2] || m[1]).replace(/-/g, " "));
    const crumb = document.querySelector("nav [data-project-name], a[href*='/g/']");
    if (crumb && crumb.textContent) return cleanText(crumb.textContent);
    return null;
  }

  async function fetchClaude() {
    const id = (path.match(/\/chat\/([0-9a-f-]{36})/i) || [])[1];
    if (!id) return null;
    const orgs = await jget("/api/organizations");
    const cookieOrg = (document.cookie.match(/lastActiveOrg=([^;]+)/) || [])[1];
    const list = Array.isArray(orgs) ? orgs : [];
    const ordered = list.slice().sort((a, b) => (a.uuid === cookieOrg ? -1 : b.uuid === cookieOrg ? 1 : 0));
    let data = null;
    let orgUuid = null;
    for (const org of ordered) {
      try {
        data = await jget(
          "/api/organizations/" + org.uuid + "/chat_conversations/" + id +
          "?tree=True&rendering_mode=messages&render_all_tools=true"
        );
        orgUuid = org.uuid;
        break;
      } catch (_) { /* try next org */ }
    }
    if (!data) throw new Error("Claude conversation API failed");
    const raw = data.chat_messages || data.messages || [];
    const turns = raw.map((m) => {
      const role = normalizeRole(m.sender || m.role || (m.author && m.author.role));
      const text = claudeText(m);
      return {
        id: m.uuid || m.id,
        role,
        speaker: role === "user" ? "You" : "Claude",
        timestamp: m.created_at || m.createdAt || null,
        text
      };
    }).filter((t) => t.text);
    const project = data.project && (data.project.name || data.project.uuid) ||
      guessClaudeProject();
    return {
      conversationId: data.uuid || id,
      title: data.name || data.title || guessTitle("claude"),
      project,
      model: data.model,
      organizationId: orgUuid,
      createdAt: data.created_at || data.createdAt || null,
      updatedAt: data.updated_at || data.updatedAt || null,
      turns
    };
  }

  function claudeText(m) {
    if (typeof m.text === "string" && m.text.trim()) return m.text.trim();
    const parts = [];
    const content = m.content || m.contents || [];
    const walk = (node) => {
      if (!node) return;
      if (typeof node === "string") { parts.push(node); return; }
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (typeof node.text === "string") parts.push(node.text);
      if (node.type === "tool_use" && node.name) parts.push("[Tool: " + node.name + "]");
      if (node.type === "artifact" && node.title) parts.push("[Artifact: " + node.title + "]");
      if (Array.isArray(node.content)) node.content.forEach(walk);
    };
    walk(content);
    if (Array.isArray(m.attachments)) {
      m.attachments.forEach((a) => {
        if (a.extracted_content) parts.push(a.extracted_content);
        else if (a.file_name || a.filename) parts.push("[Attachment: " + (a.file_name || a.filename) + "]");
      });
    }
    return parts.join("\n\n").trim();
  }

  function guessClaudeProject() {
    const m = path.match(/\/project\/([0-9a-f-]+)/i);
    const label = document.querySelector("a[href*='/project/']");
    if (label && label.textContent) return cleanText(label.textContent);
    return m ? m[1] : null;
  }

  async function fetchGrok() {
    const id = (path.match(/\/c\/([^/?#]+)/) || path.match(/conversation=([^&]+)/) || [])[1];
    if (!id) return null;
    const enc = encodeURIComponent(id);
    let detail = null;
    try { detail = await jget("/rest/app-chat/conversations_v2/" + enc); } catch (_) {}
    const convo = (detail && (detail.conversation || detail)) || {};
    let nodes = [];
    try {
      const nodePayload = await jget("/rest/app-chat/conversations/" + enc + "/response-node");
      nodes = nodePayload.responseNodes || nodePayload.nodes || nodePayload || [];
    } catch (_) {}
    const ids = (Array.isArray(nodes) ? nodes : [])
      .map((n) => n.responseId || n.id || n)
      .filter((x) => typeof x === "string");
    let loaded = [];
    if (ids.length) {
      try {
        const body = await jpost("/rest/app-chat/conversations/" + enc + "/load-responses", { responseIds: ids });
        loaded = body.responses || body.items || body || [];
      } catch (_) {}
    }
    if (!Array.isArray(loaded) || !loaded.length) {
      try {
        const body = await jpost("/rest/app-chat/conversations/" + enc + "/load-responses", {});
        loaded = body.responses || body.items || [];
      } catch (_) {}
    }
    const records = Array.isArray(loaded) ? loaded : [];
    const turns = [];
    records.forEach((r) => {
      const role = normalizeRole(r.sender || r.role || r.author);
      const text = (typeof r.message === "string" ? r.message : r.text || r.content || "").trim();
      if (!role || !text) return;
      turns.push({
        id: r.responseId || r.id,
        role,
        speaker: role === "user" ? "You" : "Grok",
        timestamp: isoFromUnix(r.createTime || r.createdAt || r.created_at),
        text
      });
    });
    return {
      conversationId: convo.conversationId || convo.id || id,
      title: convo.title || guessTitle("grok"),
      project: convo.canvasId || convo.projectId || null,
      model: convo.modelName || convo.model || null,
      createdAt: isoFromUnix(convo.createTime || convo.createdAt),
      turns
    };
  }

  /* ------------------------------------------------------------------ */
  /* DOM extractors                                                      */
  /* ------------------------------------------------------------------ */
  function extractViaDom(p) {
    const extractors = {
      chatgpt: domChatGPT,
      claude: domClaude,
      gemini: domGemini,
      grok: domGrok,
      "grok-x": domGrokX
    };
    return extractors[p]();
  }

  function turn(role, speaker, el, extra) {
    const text = htmlToMarkdown(el).trim();
    if (!text) return null;
    return Object.assign({
      role,
      speaker,
      timestamp: nearestTime(el),
      text
    }, extra || {});
  }

  function domChatGPT() {
    const nodes = [...document.querySelectorAll("[data-message-author-role], section[data-turn]")];
    const turns = [];
    nodes.forEach((el) => {
      const role = normalizeRole(el.getAttribute("data-message-author-role") || el.getAttribute("data-turn"));
      if (!role) return;
      const content = el.querySelector(".markdown, .whitespace-pre-wrap") || el;
      const t = turn(role, role === "user" ? "You" : "ChatGPT", content);
      if (t) turns.push(t);
    });
    return {
      conversationId: (path.match(/\/c\/([a-zA-Z0-9-]+)/) || [])[1] || null,
      title: guessTitle("chatgpt"),
      project: guessChatGPTProject(),
      turns
    };
  }

  function domClaude() {
    const user = [...document.querySelectorAll('[data-testid="user-message"], div.font-user-message, div.\\!font-user-message')];
    const asst = [...document.querySelectorAll(".font-claude-response, [data-is-streaming]")];
    const all = [...new Set([...user, ...asst])].sort(docOrder);
    const turns = [];
    all.forEach((el) => {
      const isUser = el.matches('[data-testid="user-message"], div.font-user-message, div.\\!font-user-message') ||
        (el.className && String(el.className).includes("font-user-message"));
      const t = turn(isUser ? "user" : "assistant", isUser ? "You" : "Claude", el);
      if (t) turns.push(t);
    });
    return {
      conversationId: (path.match(/\/chat\/([0-9a-f-]+)/i) || [])[1] || null,
      title: guessTitle("claude"),
      project: guessClaudeProject(),
      turns
    };
  }

  function domGemini() {
    const nodes = [...document.querySelectorAll("user-query, user-query-content, model-response, message-content")];
    const turns = [];
    nodes.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      const isUser = tag === "user-query" || tag === "user-query-content";
      const t = turn(isUser ? "user" : "assistant", isUser ? "You" : "Gemini", el);
      if (t) {
        t.text = t.text.replace(/^(You said|Has dicho|Tú has dicho|Gemini said)\s*/i, "");
        turns.push(t);
      }
    });
    return {
      conversationId: (path.match(/\/app\/([a-zA-Z0-9_-]+)/) || [])[1] || null,
      title: guessTitle("gemini"),
      project: null,
      turns
    };
  }

  function domGrok() {
    const bubbles = [...document.querySelectorAll(".message-bubble, [class*='message-bubble']")];
    const turns = [];
    bubbles.forEach((el) => {
      const wrap = el.closest("[class*='items-end'], [class*='items-start']") || el.parentElement;
      const cls = (wrap && wrap.className || "") + " " + (el.className || "");
      const isUser = /items-end/.test(cls);
      const t = turn(isUser ? "user" : "assistant", isUser ? "You" : "Grok", el);
      if (t) turns.push(t);
    });
    return {
      conversationId: (path.match(/\/c\/([^/?#]+)/) || [])[1] || null,
      title: guessTitle("grok"),
      project: null,
      turns
    };
  }

  function domGrokX() {
    const main = document.querySelector("main") || document.body;
    let bubbles = [...main.querySelectorAll('div[class*="r-imh66m"]')];
    if (!bubbles.length) {
      bubbles = [...main.querySelectorAll("div[data-testid], article, [class*='message']")]
        .filter((el) => cleanText(el.textContent).length > 1 && el.children.length < 20);
    }
    const turns = [];
    const seen = new Set();
    bubbles.forEach((el) => {
      const key = cleanText(el.textContent).slice(0, 80);
      if (seen.has(key)) return;
      seen.add(key);
      const cls = String(el.className || "");
      const isUser = cls.includes("r-1kt6imw") || /items-end/.test(cls);
      const t = turn(isUser ? "user" : "assistant", isUser ? "You" : "Grok", el);
      if (t && t.text.length > 0) turns.push(t);
    });
    return {
      conversationId: (location.search.match(/conversation=([^&]+)/) || [])[1] || null,
      title: guessTitle("grok-x"),
      project: null,
      turns
    };
  }

  /* ------------------------------------------------------------------ */
  /* HTML → Markdown                                                     */
  /* ------------------------------------------------------------------ */
  function htmlToMarkdown(root) {
    const clone = root.cloneNode(true);
    clone.querySelectorAll("script,style,button,svg,nav,input,textarea,[aria-hidden='true']").forEach((n) => n.remove());
    const walk = (node) => {
      if (node.nodeType === 3) return node.nodeValue.replace(/\s+/g, " ");
      if (node.nodeType !== 1) return "";
      const tag = node.tagName.toLowerCase();
      const inner = [...node.childNodes].map(walk).join("");
      if (/^h[1-6]$/.test(tag)) {
        const n = Number(tag[1]);
        return "\n\n" + "#".repeat(n) + " " + inner.trim() + "\n\n";
      }
      if (tag === "pre") {
        const code = node.querySelector("code");
        const lang = ((code && code.className) || "").match(/language-([\w+-]+)/);
        const body = (code || node).textContent.replace(/\n$/, "");
        return "\n\n```" + (lang ? lang[1] : "") + "\n" + body + "\n```\n\n";
      }
      if (tag === "code" && node.parentElement && node.parentElement.tagName.toLowerCase() !== "pre") {
        return "`" + node.textContent + "`";
      }
      if (tag === "strong" || tag === "b") return "**" + inner.trim() + "**";
      if (tag === "em" || tag === "i") return "*" + inner.trim() + "*";
      if (tag === "a") {
        const hrefAttr = node.getAttribute("href");
        return hrefAttr ? "[" + inner.trim() + "](" + hrefAttr + ")" : inner;
      }
      if (tag === "img") {
        const src = node.getAttribute("src") || node.getAttribute("data-src") || "";
        const alt = node.getAttribute("alt") || "image";
        return src ? "![" + alt + "](" + src + ")" : "";
      }
      if (tag === "li") {
        const parent = node.parentElement && node.parentElement.tagName.toLowerCase();
        const bullet = parent === "ol" ? "1. " : "- ";
        return bullet + inner.trim() + "\n";
      }
      if (tag === "ul" || tag === "ol") return "\n" + inner + "\n";
      if (tag === "br") return "\n";
      if (tag === "blockquote") return "\n> " + inner.trim().replace(/\n/g, "\n> ") + "\n";
      if (tag === "p" || tag === "div" || tag === "section") return inner.trim() ? "\n\n" + inner.trim() + "\n\n" : "";
      if (tag === "table") return "\n\n" + tableToMd(node) + "\n\n";
      return inner;
    };
    return walk(clone).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function tableToMd(table) {
    const rows = [...table.querySelectorAll("tr")].map((tr) =>
      [...tr.children].map((td) => cleanText(td.textContent).replace(/\|/g, "\\|"))
    );
    if (!rows.length) return "";
    const head = rows[0];
    const sep = head.map(() => "---");
    const rest = rows.slice(1);
    return [head, sep, ...rest].map((r) => "| " + r.join(" | ") + " |").join("\n");
  }

  /* ------------------------------------------------------------------ */
  /* Markdown / helpers                                                  */
  /* ------------------------------------------------------------------ */
  function toMarkdown(convo) {
    const lines = [];
    lines.push("---");
    lines.push("exported_at: " + convo.exportedAt);
    lines.push("platform: " + convo.platform);
    lines.push("source: " + convo.source);
    lines.push("url: " + convo.url);
    if (convo.title) lines.push("title: " + yamlSafe(convo.title));
    if (convo.project) lines.push("project: " + yamlSafe(convo.project));
    if (convo.conversationId) lines.push("conversation_id: " + convo.conversationId);
    if (convo.model) lines.push("model: " + convo.model);
    if (convo.createdAt) lines.push("created_at: " + convo.createdAt);
    if (convo.updatedAt) lines.push("updated_at: " + convo.updatedAt);
    lines.push("turns: " + convo.turns.length);
    lines.push("exporter: " + convo.exporter + " " + convo.exporterVersion);
    lines.push("---");
    lines.push("");
    lines.push("# " + (convo.title || "Conversation"));
    lines.push("");
    lines.push("- **Platform:** " + labelFor(convo.platform));
    if (convo.project) lines.push("- **Project:** " + convo.project);
    lines.push("- **URL:** " + convo.url);
    if (convo.createdAt) lines.push("- **Created:** " + convo.createdAt);
    if (convo.updatedAt) lines.push("- **Updated:** " + convo.updatedAt);
    lines.push("- **Exported:** " + convo.exportedAt);
    lines.push("- **Turns:** " + convo.turns.length);
    lines.push("- **Source:** " + convo.source + (convo.source === "api" ? " (full conversation)" : " (rendered turns after scroll)"));
    lines.push("");
    convo.turns.forEach((t, i) => {
      lines.push("---");
      lines.push("");
      const when = t.timestamp ? " — " + t.timestamp : "";
      lines.push("### " + (t.speaker || t.role) + " · turn " + (i + 1) + when);
      lines.push("");
      lines.push(t.text);
      lines.push("");
    });
    return lines.join("\n");
  }

  function labelFor(p) {
    return ({
      chatgpt: "ChatGPT",
      claude: "Claude",
      gemini: "Gemini",
      grok: "Grok",
      "grok-x": "Grok on X"
    })[p] || p;
  }

  function guessTitle(p) {
    const raw = (document.title || "")
      .replace(/\s*[|–—-]\s*(ChatGPT|Claude|Gemini|Grok|X|Twitter).*$/i, "")
      .replace(/\s+on X\s*$/i, "")
      .trim();
    if (raw && raw.length > 1 && !/^(ChatGPT|Claude|Gemini|Grok|X)$/i.test(raw)) return raw;
    const heading = document.querySelector("h1, [data-testid='conversation-title']");
    if (heading && cleanText(heading.textContent)) return cleanText(heading.textContent);
    return p + " conversation";
  }

  function nearestTime(el) {
    const t = el.querySelector && el.querySelector("time");
    if (t && (t.dateTime || t.getAttribute("datetime"))) return t.dateTime || t.getAttribute("datetime");
    if (t && t.textContent) return cleanText(t.textContent);
    return null;
  }

  function normalizeRole(r) {
    const s = String(r || "").toLowerCase();
    if (s === "user" || s === "human" || s === "you") return "user";
    if (s === "assistant" || s === "bot" || s === "model" || s === "grok" || s === "claude" || s === "gemini" || s === "chatgpt") return "assistant";
    return null;
  }

  function isoFromUnix(v) {
    if (v == null || v === "") return null;
    if (typeof v === "string" && /T/.test(v)) return v;
    const n = Number(v);
    if (!Number.isFinite(n) || n <= 0) return null;
    const ms = n < 1e12 ? n * 1000 : n;
    return new Date(ms).toISOString();
  }

  function cleanText(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function slugify(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function yamlSafe(s) {
    const t = String(s).replace(/"/g, '\\"');
    return /[:#\n]/.test(t) ? '"' + t + '"' : t;
  }

  function docOrder(a, b) {
    const pos = a.compareDocumentPosition(b);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  }

  function download(name, text, type) {
    const blob = new Blob([text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
})();
