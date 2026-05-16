// Place 30 stations around a ring SVG, wire clicks to /api/stations/{id}.

const TYPE_JP = {
  redev: "再開発",
  open: "OPEN",
  close: "閉鎖",
  transit: "交通",
  construction: "工事",
};

const ring = document.querySelector("#ring");
const dataEl = document.querySelector("#ring-data");
const todayEl = document.querySelector("#today-id");
const detailName = document.querySelector("#detail-name");
const detailEvents = document.querySelector("#detail-events");
const stations = JSON.parse(dataEl.textContent);
const todayId = JSON.parse(todayEl.textContent);

const NS = "http://www.w3.org/2000/svg";
const R = 90;

stations.forEach((s) => {
  const angle = (2 * Math.PI * s.ring_index) / stations.length - Math.PI / 2;
  const x = R * Math.cos(angle);
  const y = R * Math.sin(angle);
  const isToday = s.id === todayId;

  const dot = document.createElementNS(NS, "circle");
  dot.setAttribute("cx", x.toFixed(2));
  dot.setAttribute("cy", y.toFixed(2));
  dot.setAttribute("r", isToday ? 6 : 3);
  dot.setAttribute("fill", isToday ? "var(--gold)" : "var(--ink-2)");
  dot.classList.add("ring-station");
  if (isToday) dot.classList.add("today");
  dot.setAttribute("data-id", s.id);
  dot.setAttribute("tabindex", "0");
  dot.setAttribute("role", "button");
  dot.setAttribute("aria-label", s.jp);
  dot.addEventListener("click", () => loadDetail(s.id));
  dot.addEventListener("keydown", (e) => { if (e.key === "Enter") loadDetail(s.id); });
  ring.appendChild(dot);

  // Outer label
  const lr = R + 14;
  const lx = lr * Math.cos(angle);
  const ly = lr * Math.sin(angle);
  const text = document.createElementNS(NS, "text");
  text.setAttribute("x", lx.toFixed(2));
  text.setAttribute("y", ly.toFixed(2));
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "central");
  text.classList.add("ring-label");
  if (isToday) text.classList.add("today");
  text.textContent = s.jp;
  ring.appendChild(text);
});

async function loadDetail(id) {
  try {
    const res = await fetch(`/api/stations/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const s = await res.json();
    detailName.textContent = `${s.jp}  /  ${s.kana}`;
    detailEvents.innerHTML = "";
    s.events.forEach((ev) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="ev-date">${ev.year}.${String(ev.month).padStart(2, "0")}</span>
        <span class="ev-type tag t-${ev.type}">${TYPE_JP[ev.type] || ev.type}</span>
        <span class="ev-blurb">${ev.blurb}</span>
      `;
      detailEvents.appendChild(li);
    });
  } catch (err) {
    detailName.textContent = "読み込みに失敗しました";
    detailEvents.innerHTML = "";
  }
}

// Preload today's station into the right pane
loadDetail(todayId);
