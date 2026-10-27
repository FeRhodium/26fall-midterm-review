(function () {
  const chapters = [];
  let C = null;

  window.Review = {
    setup(config) { C = config; },
    add(chapter) { chapters.push(chapter); },
    start
  };

  function start() {
    const groupOrder = C.groups.map((g) => g.id);
    chapters.sort((a, b) => groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group) || (a.n || 0) - (b.n || 0));
    const questions = [];
    const cards = [];
    chapters.forEach((ch) => {
      (ch.questions || []).forEach((q) => questions.push({ ...q, uid: ch.id + ":" + q.id, ch: ch.id }));
      (ch.cards || []).forEach((c, i) => cards.push({ uid: ch.id + ":" + i, ch: ch.id, front: c[0], back: c[1] }));
    });

    const main = document.getElementById("main");
    const nav = document.getElementById("nav");
    const KEY = "review-" + C.key;
    let state;
    try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { state = {}; }
    state.read = state.read || {};
    state.answers = state.answers || {};
    state.cards = state.cards || {};
    const save = () => localStorage.setItem(KEY, JSON.stringify(state));

    let quiz = { filter: "", index: 0, picks: [], revealed: false, showOut: false };
    let deck = { filter: "", index: 0, flipped: false, onlyNew: false };

    document.title = C.code + " 期中复习";
    const others = Array.isArray(C.other) ? C.other : (C.other ? [C.other] : []);
    document.getElementById("brand").innerHTML =
      `<b>${C.code} 期中复习</b><span>${C.name}${others.map((o) => ` · <a href="${o.href}">去 ${o.label}</a>`).join("")} · <a href="../">入口</a></span>`;
    document.getElementById("seat").innerHTML = C.exam.badge;

    const byId = (id) => chapters.find((c) => c.id === id);
    const group = (id) => C.groups.find((g) => g.id === id) || { label: id };
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

    let tmState = null;
    function route() {
      if (tmState && tmState.timer && !(location.hash || "").startsWith("#/tm")) {
        clearInterval(tmState.timer);
        tmState.timer = null;
      }
      const parts = (location.hash || "#/").replace(/^#\/?/, "").split("/").filter(Boolean);
      const [mode, arg] = parts;
      renderNav(mode, arg);
      if (mode === "c" && byId(arg)) renderChapter(byId(arg));
      else if (mode === "quiz") renderQuiz(decodeURIComponent(arg || "all"));
      else if (mode === "cards") renderCards(decodeURIComponent(arg || "all"));
      else if (mode === "tm" && C.tm && C.tm.length) renderTM(arg);
      else if (mode === "sheet") renderSheet();
      else renderHome();
      typeset(main);
    }

    function renderNav(mode, arg) {
      const out = [`<a class="${!mode ? "active" : ""}" href="#/">总览<small>考试信息与复习顺序</small></a>`];
      C.groups.forEach((g) => {
        const list = chapters.filter((c) => c.group === g.id);
        if (!list.length) return;
        out.push(`<div class="group">${g.label}</div>`);
        list.forEach((c) => out.push(
          `<a class="sub ${mode === "c" && arg === c.id ? "active" : ""} ${state.read[c.id] ? "read" : ""}" href="#/c/${c.id}">${c.short}</a>`
        ));
      });
      out.push(`<div class="group">练习</div>`);
      out.push(`<a class="sub ${mode === "quiz" ? "active" : ""}" href="#/quiz">题库<small>${questions.length} 题</small></a>`);
      out.push(`<a class="sub ${mode === "cards" ? "active" : ""}" href="#/cards">闪卡<small>${cards.length} 张</small></a>`);
      if (C.tm && C.tm.length) out.push(`<a class="sub ${mode === "tm" ? "active" : ""}" href="#/tm">图灵机模拟<small>${C.tm.length} 台预设机单步调试</small></a>`);
      if (C.sheet) out.push(`<a class="sub ${mode === "sheet" ? "active" : ""}" href="#/sheet">考前提纲<small>进考场前默写一遍</small></a>`);
      nav.innerHTML = out.join("");
      const active = nav.querySelector("a.active");
      if (active && active.scrollIntoViewIfNeeded) active.scrollIntoViewIfNeeded();
    }

    function renderHome() {
      const graded = questions.filter((q) => state.answers[q.uid]);
      const right = graded.filter((q) => state.answers[q.uid].ok).length;
      const readN = chapters.filter((c) => state.read[c.id]).length;
      main.innerHTML = `
        ${C.home}
        <div class="progress"><span style="width:${chapters.length ? (readN / chapters.length) * 100 : 0}%"></span></div>
        <p class="muted">讲义读完 ${readN}/${chapters.length} 章 · 题库做过 ${graded.length}/${questions.length} 题，答对 ${right} 题 · <a href="#/quiz/wrong">错题本</a></p>
        ${C.groups.map((g) => {
          const list = chapters.filter((c) => c.group === g.id);
          if (!list.length) return "";
          return `<h2>${g.label}</h2>${g.note ? `<p class="muted">${g.note}</p>` : ""}<ol class="timeline">${list.map((c) => {
            const nq = questions.filter((q) => q.ch === c.id).length;
            return `<li><span class="tag ${state.read[c.id] ? "" : "warn"}">${state.read[c.id] ? "已读" : "未读"}</span><a href="#/c/${c.id}"><b>${c.title}</b><br><span class="muted">${c.meta}${nq ? ` · ${nq} 题` : ""}</span></a></li>`;
          }).join("")}</ol>`;
        }).join("")}
      `;
      window.scrollTo(0, 0);
    }

    function renderChapter(c) {
      const i = chapters.indexOf(c);
      const prev = chapters[i - 1];
      const next = chapters[i + 1];
      const nq = questions.filter((q) => q.ch === c.id).length;
      const nc = cards.filter((x) => x.ch === c.id).length;
      main.innerHTML = `
        <p class="kicker">${group(c.group).label} · ${c.meta}</p>
        <h1>${c.title}</h1>
        ${c.sources && c.sources.length ? `<p class="sources">原始资料：${c.sources.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`).join("")}</p>` : ""}
        <nav class="toc" id="toc"></nav>
        <div class="note">${c.html}</div>
        <div class="toolbar chapter-end">
          <button type="button" id="mark" class="${state.read[c.id] ? "active" : ""}">${state.read[c.id] ? "已读完" : "标记为已读"}</button>
          ${nq ? `<a class="btn" href="#/quiz/ch:${c.id}">做本章 ${nq} 题</a>` : ""}
          ${nc ? `<a class="btn" href="#/cards/ch:${c.id}">本章 ${nc} 张闪卡</a>` : ""}
          ${prev ? `<a class="btn" href="#/c/${prev.id}">上一章：${prev.short}</a>` : ""}
          ${next ? `<a class="btn primary" href="#/c/${next.id}">下一章：${next.short}</a>` : `<a class="btn primary" href="#/quiz">去题库</a>`}
        </div>
      `;
      const heads = [...main.querySelectorAll(".note h2")];
      const toc = document.getElementById("toc");
      if (heads.length > 2) {
        toc.innerHTML = `<b>本章目录</b><ol>${heads.map((h, k) => {
          h.id = "s" + k;
          return `<li><a href="javascript:void 0" data-to="s${k}">${h.textContent}</a></li>`;
        }).join("")}</ol>`;
        toc.querySelectorAll("[data-to]").forEach((a) => {
          a.onclick = () => document.getElementById(a.dataset.to).scrollIntoView({ behavior: "smooth" });
        });
      } else toc.remove();
      document.getElementById("mark").onclick = () => {
        state.read[c.id] = !state.read[c.id];
        save();
        route();
      };
      window.scrollTo(0, 0);
    }

    function filterLabel(f) {
      if (f === "all") return "全部";
      if (f === "wrong") return "错题本";
      if (f.startsWith("ch:")) return (byId(f.slice(3)) || {}).short || f;
      if (f.startsWith("g:")) return group(f.slice(2)).label;
      if (f.startsWith("tag:")) return C.tags[f.slice(4)] || f;
      return f;
    }

    function pool(f) {
      let list = questions.filter((q) => quiz.showOut || !q.out);
      if (f === "wrong") return list.filter((q) => state.answers[q.uid] && !state.answers[q.uid].ok);
      if (f.startsWith("ch:")) return list.filter((q) => q.ch === f.slice(3));
      if (f.startsWith("g:")) return list.filter((q) => (byId(q.ch) || {}).group === f.slice(2));
      if (f.startsWith("tag:")) return list.filter((q) => q.tag === f.slice(4));
      return list;
    }

    function renderQuiz(f) {
      if (quiz.filter !== f) quiz = { ...quiz, filter: f, index: 0, picks: [], revealed: false };
      const list = pool(f);
      const filters = ["all", ...C.groups.map((g) => "g:" + g.id), ...Object.keys(C.tags).map((t) => "tag:" + t), "wrong"]
        .filter((x) => x === "all" || x === "wrong" || pool(x).length);
      const chapterSel = `<select id="chsel"><option value="">按章节…</option>${chapters.filter((c) => questions.some((q) => q.ch === c.id))
        .map((c) => `<option value="ch:${c.id}" ${f === "ch:" + c.id ? "selected" : ""}>${c.short}</option>`).join("")}</select>`;
      const hasOut = questions.some((q) => q.out);
      const head = `
        <p class="kicker">题库 · ${filterLabel(f)}</p>
        <h1>练习</h1>
        <div class="toolbar">
          ${filters.map((x) => `<a class="btn ${x === f ? "primary" : ""}" href="#/quiz/${encodeURIComponent(x)}">${filterLabel(x)}</a>`).join("")}
          ${chapterSel}
          ${hasOut ? `<button type="button" id="out">${quiz.showOut ? "隐藏超纲题" : "显示超纲题"}</button>` : ""}
        </div>`;
      if (!list.length) {
        main.innerHTML = head + `<p>${f === "wrong" ? "还没有答错的题。" : "这个筛选下没有题。"}</p>`;
        bindQuizHead(f);
        return;
      }
      if (quiz.index >= list.length) quiz.index = 0;
      const q = list[quiz.index];
      const choices = q.kind === "tf" ? [["t", "True"], ["f", "False"]] : q.choices;
      const show = quiz.revealed;
      const ch = byId(q.ch);
      main.innerHTML = head + `
        <div class="dots">${list.map((x, k) => {
          const a = state.answers[x.uid];
          return `<button type="button" data-jump="${k}" class="${k === quiz.index ? "on" : ""} ${a ? (a.ok ? "ok" : "no") : ""}">${k + 1}</button>`;
        }).join("")}</div>
        <article class="q">
          <div class="q-meta">${quiz.index + 1} / ${list.length} · ${{ tf: "判断", single: "单选", multi: C.code === "CSC4010" ? "多选（4 分，每误选/漏选一项 −1，最低 0）" : "多选（对一个 +4，错一个 −4，最低 0）" }[q.kind]} · ${C.tags[q.tag] || q.tag} · <a href="#/c/${q.ch}">${ch ? ch.short : q.ch}</a>${q.out ? " · 超出本次范围" : ""}</div>
          <div class="q-body">${q.q}</div>
          <div class="choices">${choices.map(([id, text]) => {
            const picked = quiz.picks.includes(id);
            const cls = show ? (q.answer.includes(id) ? "good" : picked ? "bad" : "") : "";
            return `<label class="choice ${cls}"><input type="${q.kind === "multi" ? "checkbox" : "radio"}" name="pick" value="${id}" ${picked ? "checked" : ""} ${show ? "disabled" : ""}><span>${text}</span></label>`;
          }).join("")}</div>
          ${show ? `<div class="why"><b>${verdict(q, quiz.picks)}</b><div>${q.why}</div></div>` : ""}
          <div class="q-nav">
            <button type="button" class="btn" id="prev" ${quiz.index === 0 ? "disabled" : ""}>上一题</button>
            ${show ? `<button type="button" class="btn primary" id="next">${quiz.index === list.length - 1 ? "回到第一题" : "下一题"}</button>`
                   : `<button type="button" class="btn primary" id="grade">核对</button>`}
          </div>
        </article>`;
      bindQuizHead(f);
      main.querySelectorAll("[data-jump]").forEach((b) => {
        b.onclick = () => { quiz = { ...quiz, index: +b.dataset.jump, picks: [], revealed: false }; route(); };
      });
      main.querySelectorAll("input[name=pick]").forEach((inp) => {
        inp.onchange = () => {
          quiz.picks = [...main.querySelectorAll("input[name=pick]:checked")].map((x) => x.value);
        };
      });
      const on = (id, fn) => { const el = document.getElementById(id); if (el) el.onclick = fn; };
      on("prev", () => { quiz = { ...quiz, index: quiz.index - 1, picks: [], revealed: false }; route(); });
      on("next", () => { quiz = { ...quiz, index: (quiz.index + 1) % list.length, picks: [], revealed: false }; route(); });
      on("grade", () => {
        if (!quiz.picks.length) return;
        state.answers[q.uid] = { ok: same(quiz.picks, q.answer), picks: quiz.picks.slice() };
        save();
        quiz.revealed = true;
        route();
      });
    }

    function bindQuizHead(f) {
      const sel = document.getElementById("chsel");
      if (sel) sel.onchange = () => { if (sel.value) location.hash = "#/quiz/" + encodeURIComponent(sel.value); };
      const out = document.getElementById("out");
      if (out) out.onclick = () => { quiz = { ...quiz, showOut: !quiz.showOut, index: 0, picks: [], revealed: false }; route(); };
    }

    const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
    function verdict(q, picks) {
      const ok = same(picks, q.answer);
      if (q.kind !== "multi") return ok ? "对。" : "不对。";
      if (C.code === "CSC4010") {
        const allIds = (q.choices || []).map((x) => x[0]);
        const errs = allIds.filter((id) => picks.includes(id) !== q.answer.includes(id)).length;
        const s = Math.max(0, 4 - errs);
        return (ok ? "全对。" : "没有全对。") + `按样卷规则得 ${s} / 4 分（错判 ${errs} 项）。`;
      }
      const s = Math.max(0, picks.reduce((t, id) => t + (q.answer.includes(id) ? 4 : -4), 0));
      return (ok ? "全对。" : "没有全对。") + `按样卷规则得 ${s} 分（满分 ${q.answer.length * 4}）。`;
    }

    function renderCards(f) {
      if (deck.filter !== f) deck = { ...deck, filter: f, index: 0, flipped: false };
      let list = cards.filter((c) => f === "all" || (f.startsWith("ch:") && c.ch === f.slice(3)) || (f.startsWith("g:") && (byId(c.ch) || {}).group === f.slice(2)));
      if (deck.onlyNew) list = list.filter((c) => state.cards[c.uid] !== "know");
      const known = cards.filter((c) => state.cards[c.uid] === "know").length;
      const chapterSel = `<select id="chsel"><option value="">按章节…</option>${chapters.filter((c) => cards.some((x) => x.ch === c.id))
        .map((c) => `<option value="ch:${c.id}" ${f === "ch:" + c.id ? "selected" : ""}>${c.short}</option>`).join("")}</select>`;
      const head = `
        <p class="kicker">闪卡 · ${filterLabel(f)}</p>
        <h1>闪卡</h1>
        <p class="muted">已掌握 ${known}/${cards.length}。点卡片翻面。</p>
        <div class="toolbar">
          <a class="btn ${f === "all" ? "primary" : ""}" href="#/cards">全部</a>
          ${C.groups.filter((g) => cards.some((c) => (byId(c.ch) || {}).group === g.id)).map((g) => `<a class="btn ${f === "g:" + g.id ? "primary" : ""}" href="#/cards/g:${g.id}">${g.label}</a>`).join("")}
          ${chapterSel}
          <button type="button" id="onlynew" class="${deck.onlyNew ? "active" : ""}">只看没掌握的</button>
        </div>`;
      if (!list.length) {
        main.innerHTML = head + `<p>这一组都掌握了。</p>`;
      } else {
        if (deck.index >= list.length) deck.index = 0;
        const c = list[deck.index];
        const ch = byId(c.ch);
        main.innerHTML = head + `
          <div class="cardface ${deck.flipped ? "flipped" : ""}" id="flip"><div>${deck.flipped ? c.back : c.front}</div></div>
          <div class="card-actions">
            <button type="button" class="btn" id="again">还不熟</button>
            <button type="button" class="btn primary" id="know">记住了</button>
            <span class="muted">${deck.index + 1} / ${list.length} · <a href="#/c/${c.ch}">${ch ? ch.short : ""}</a>${state.cards[c.uid] === "know" ? " · 已掌握" : ""}</span>
          </div>`;
        document.getElementById("flip").onclick = () => { deck.flipped = !deck.flipped; route(); };
        const step = (mark) => {
          state.cards[c.uid] = mark;
          save();
          if (!(deck.onlyNew && mark === "know")) deck.index = (deck.index + 1) % list.length;
          deck.flipped = false;
          route();
        };
        document.getElementById("again").onclick = () => step("again");
        document.getElementById("know").onclick = () => step("know");
      }
      const sel = document.getElementById("chsel");
      sel.onchange = () => { if (sel.value) location.hash = "#/cards/" + encodeURIComponent(sel.value); };
      document.getElementById("onlynew").onclick = () => { deck = { ...deck, onlyNew: !deck.onlyNew, index: 0, flipped: false }; route(); };
    }

    function renderTM(arg) {
      const m = C.tm.find((x) => x.id === arg) || C.tm[0];
      const initTM = (machine, input) => {
        if (tmState && tmState.timer) clearInterval(tmState.timer);
        const clean = String(input ?? machine.defaultInput ?? "").replace(/[^01]/g, "");
        const cells = {};
        cells[0] = "⊔";
        for (let i = 0; i < clean.length; i++) cells[i + 1] = clean[i];
        tmState = {
          id: machine.id,
          input: clean,
          cells,
          head: 0,
          state: machine.startState,
          step: 0,
          halted: false,
          status: "运行中（初始配置 C₀ = " + machine.startState + " ⊔ " + (clean || "ε") + "）",
          lastRule: null,
          history: [`C₀: ${machine.startState} ⊔ ${clean}`],
          timer: null
        };
      };
      if (!tmState || tmState.id !== m.id) initTM(m, m.defaultInput);

      const getCell = (idx) => tmState.cells[idx] || "⊔";
      const configStr = () => {
        const keys = Object.keys(tmState.cells).map(Number);
        const minK = Math.min(0, tmState.head, ...keys);
        const maxK = Math.max(tmState.input.length, tmState.head, ...keys);
        let u = "", v = "";
        for (let i = minK; i < tmState.head; i++) u += getCell(i);
        for (let i = tmState.head; i <= maxK; i++) v += getCell(i);
        u = u.replace(/^⊔+/, "");
        v = v.replace(/⊔+$/, "") || "⊔";
        return `${u} [${tmState.state}] ${v}`;
      };

      const stepOnce = () => {
        if (tmState.halted) return;
        const sym = getCell(tmState.head);
        const rule = m.transitions.find((t) => t.from === tmState.state && t.read === sym);
        if (!rule) {
          tmState.halted = true;
          tmState.status = "未定义转移，停机拒绝";
          return;
        }
        tmState.lastRule = rule;
        tmState.cells[tmState.head] = rule.write;
        if (rule.move === "L") tmState.head -= 1;
        else if (rule.move === "R") tmState.head += 1;
        tmState.state = rule.to;
        tmState.step += 1;
        tmState.history.push(`C_${tmState.step}: ${configStr()}  (δ(${rule.from}, ${rule.read}) = (${rule.to}, ${rule.write}, ${rule.move}))`);
        if (tmState.state === m.acceptState) {
          tmState.halted = true;
          tmState.status = `已接受 (q_acc = ${m.acceptState})，共 ${tmState.step} 步`;
        } else if (tmState.state === m.rejectState) {
          tmState.halted = true;
          tmState.status = `已拒绝 (q_rej = ${m.rejectState})，共 ${tmState.step} 步`;
        } else if (tmState.step >= 200) {
          tmState.halted = true;
          tmState.status = "已达 200 步上限（可能死循环）";
        } else {
          tmState.status = `第 ${tmState.step} 步 · 当前状态 ${tmState.state}`;
        }
      };

      const keys = Object.keys(tmState.cells).map(Number);
      const minIdx = Math.min(-1, tmState.head - 2, ...keys);
      const maxIdx = Math.max(tmState.input.length + 2, tmState.head + 2, ...keys);
      const tapeCells = [];
      for (let i = minIdx; i <= maxIdx; i++) {
        const active = i === tmState.head;
        tapeCells.push(`<div class="tm-cell ${active ? "active" : ""}"><small>${i}</small><b>${esc(getCell(i))}</b><span>${active ? "▲ " + esc(tmState.state) : ""}</span></div>`);
      }

      main.innerHTML = `
        <p class="kicker">交互式形式化模型 · 严格对应课程约定（读写头初始位于 w 左侧空白格 ⊔，索引 0）</p>
        <h1>图灵机模拟器</h1>
        <div class="toolbar">
          ${C.tm.map((x) => `<a class="btn ${x.id === m.id ? "primary" : ""}" href="#/tm/${x.id}">${x.name}</a>`).join("")}
        </div>
        <div class="card">
          <h3>${m.name} <small class="muted">(${m.source})</small></h3>
          <p>${m.description}</p>
          <p class="muted">形式化参数：<code>Q = {${m.states.join(", ")}}</code>，初始状态 <code>${m.startState}</code>，接受状态 <code>${m.acceptState}</code>，拒绝状态 <code>${m.rejectState}</code>。</p>
          <div class="toolbar">
            <label>输入串 \(w\in\{0,1\}^*\)：<input type="text" id="tm-inp" value="${esc(tmState.input)}" placeholder="如 0110（空串留空）" style="padding:5px 10px;border:1px solid var(--line);border-radius:8px;width:160px;margin:0 6px"></label>
            <button type="button" id="tm-load">加载/重置</button>
            <button type="button" class="btn primary" id="tm-step" ${tmState.halted ? "disabled" : ""}>单步执行 (NEXT)</button>
            <button type="button" id="tm-run" ${tmState.halted ? "disabled" : ""}>${tmState.timer ? "暂停自动运行" : "自动运行"}</button>
          </div>
          <p><strong>状态：</strong><span class="tag ${tmState.state === m.acceptState ? "" : tmState.state === m.rejectState ? "warn" : ""}">${esc(tmState.status)}</span> · <strong>当前配置：</strong><code>${esc(configStr())}</code></p>
          <div class="tm-tape">${tapeCells.join("")}</div>
        </div>
        <div class="note">
          <h2>状态转移表 \(\delta(q, b) = (q', c, D)\)</h2>
          <table>
            <thead><tr><th>当前状态 \(q\)</th><th>读取符号 \(b\)</th><th>下一状态 \(q'\)</th><th>写入符号 \(c\)</th><th>移动方向 \(D\)</th><th>设计意图与不变式说明</th></tr></thead>
            <tbody>
              ${m.transitions.map((t) => {
                const hit = tmState.lastRule && tmState.lastRule.from === t.from && tmState.lastRule.read === t.read;
                const next = !tmState.halted && tmState.state === t.from && getCell(tmState.head) === t.read;
                return `<tr class="${hit ? "tm-hit" : next ? "tm-next" : ""}"><td><code>${esc(t.from)}</code></td><td><code>${esc(t.read)}</code></td><td><code>${esc(t.to)}</code></td><td><code>${esc(t.write)}</code></td><td><code>${esc(t.move)}</code></td><td>${esc(t.comment || "")}</td></tr>`;
              }).join("")}
            </tbody>
          </table>
          <h2>计算配置轨迹 \(\mathrm{NEXT}(C_i)=C_{i+1}\)</h2>
          <pre>${esc(tmState.history.join("\n"))}</pre>
        </div>
      `;

      document.getElementById("tm-load").onclick = () => {
        const val = document.getElementById("tm-inp").value;
        initTM(m, val);
        route();
      };
      document.getElementById("tm-step").onclick = () => {
        stepOnce();
        route();
      };
      document.getElementById("tm-run").onclick = () => {
        if (tmState.timer) {
          clearInterval(tmState.timer);
          tmState.timer = null;
          route();
        } else {
          tmState.timer = setInterval(() => {
            stepOnce();
            if (tmState.halted) {
              clearInterval(tmState.timer);
              tmState.timer = null;
            }
            route();
          }, 350);
          route();
        }
      };
    }

    function renderSheet() {
      main.innerHTML = `
        <p class="kicker">${C.sheetKicker || "闭卷考试，这页不能带进考场"}</p>
        <h1>考前提纲</h1>
        <p class="no-print"><button type="button" class="btn primary" id="print">打印 / 存成 PDF</button></p>
        <div class="sheet">${C.sheet}</div>`;
      document.getElementById("print").onclick = () => window.print();
      window.scrollTo(0, 0);
    }

    function typeset(el) {
      if (!window.renderMathInElement) return;
      window.renderMathInElement(el, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false }
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
        throwOnError: false
      });
    }

    function tick() {
      const el = document.getElementById("countdown");
      if (!C.exam.start) { el.innerHTML = `<strong>${C.exam.when}</strong><span>${C.exam.where}</span>`; return; }
      const ms = new Date(C.exam.start) - new Date();
      if (ms <= 0) { el.innerHTML = `<strong>考试已开始</strong><span>${C.exam.when}</span>`; return; }
      const s = Math.floor(ms / 1000);
      el.innerHTML = `<strong>${Math.floor(s / 86400)} 天 ${Math.floor((s % 86400) / 3600)} 时 ${Math.floor((s % 3600) / 60)} 分</strong><span>${C.exam.when} · ${C.exam.where}</span>`;
    }

    window.addEventListener("hashchange", route);
    tick();
    setInterval(tick, 30000);
    route();
  }
})();
