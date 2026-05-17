(() => {
  const POLL_MS = 10000;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  async function setPromise(idx) {
    const res = await fetch("/api/set-promise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ritual_index: idx }),
    });
    if (!res.ok) throw new Error("set-promise failed");
    await refresh();
  }

  async function markDone() {
    const note = document.getElementById("note-input")?.value || "";
    const res = await fetch("/api/mark-done", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) {
      console.error("mark-done failed");
      return;
    }
    await refresh();
  }

  async function clearPromise() {
    if (!confirm("今夜 の 約束 を 解除 します。 よろしい です か?")) return;
    await fetch("/api/clear-promise", { method: "POST" });
    await refresh();
  }

  async function refresh() {
    try {
      const res = await fetch("/api/state");
      if (!res.ok) return;
      const state = await res.json();
      render(state);
    } catch (e) {
      // silent — keep last state
    }
  }

  function render(state) {
    // Highlight active ritual card
    const promise = state.promise;
    document.querySelectorAll(".ritual-card").forEach((el) => {
      const idx = Number(el.dataset.idx);
      const active = !!promise && promise.ritual_index === idx;
      el.classList.toggle("is-active", active);
    });

    // Re-render promise section
    const section = document.getElementById("promise-section");
    section.innerHTML = promiseHtml(promise);
    attachPromiseHandlers();

    // Re-render timeline
    const list = document.getElementById("timeline-list");
    list.innerHTML = timelineHtml(state.timeline);
  }

  function promiseHtml(p) {
    if (!p) {
      return `
        <div class="promise-card promise-empty">
          <div class="promise-tag">今夜 の 約束</div>
          <div class="promise-text">まだ 何 も 約束 して い ません。 上 の 候補 から 1 つ 選んで ください。</div>
        </div>`;
    }
    const doneStamp = p.status === "done"
      ? `<span class="promise-stamp">やった ね</span>` : "";
    const noteRow = p.note ? `<div class="promise-note">${escapeHtml(p.note)}</div>` : "";
    const actions = p.status === "done"
      ? `<button id="clear-btn" class="ghost-btn">約束 を 解除</button>`
      : `<input id="note-input" class="note-input" placeholder="ひと こと (任意)" maxlength="80">
         <button id="done-btn" class="primary-btn">やった ね</button>
         <button id="clear-btn" class="ghost-btn">約束 を 解除</button>`;
    return `
      <div class="promise-card promise-${escapeHtml(p.status)}">
        <div class="promise-head">
          <span class="promise-tag">今夜 の 約束</span>
          ${doneStamp}
        </div>
        <div class="promise-text">${escapeHtml(p.ritual_text)}</div>
        ${noteRow}
        <div class="promise-actions">${actions}</div>
      </div>`;
  }

  function timelineHtml(entries) {
    if (!entries || !entries.length) {
      return `<li class="timeline-empty">まだ 記録 が ありません。 1 つ 終える と ここ に 残り ます。</li>`;
    }
    return entries.map((t) => `
      <li class="timeline-item timeline-${escapeHtml(t.status)}">
        <span class="timeline-date">${escapeHtml(t.date.slice(5))}</span>
        <span class="timeline-ritual">${escapeHtml(t.ritual_text)}</span>
        <span class="timeline-status">${t.status === "done" ? "✓" : "—"}</span>
      </li>`).join("");
  }

  function attachPromiseHandlers() {
    document.getElementById("done-btn")?.addEventListener("click", markDone);
    document.getElementById("clear-btn")?.addEventListener("click", clearPromise);
  }

  function attach() {
    document.querySelectorAll(".ritual-pick").forEach((btn) => {
      btn.addEventListener("click", () => setPromise(Number(btn.dataset.idx)));
    });
    attachPromiseHandlers();
  }

  attach();
  setInterval(refresh, POLL_MS);
})();
