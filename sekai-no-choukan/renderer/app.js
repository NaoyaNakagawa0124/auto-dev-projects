// Renderer — talks to main via window.choukan (set by preload.js).

const $ = (sel) => document.querySelector(sel);

let currentDate = new Date();

function renderStoryNode(story, legend) {
  const node = document.createElement("article");
  node.className = "story";
  node.setAttribute("data-region", story.region);
  node.setAttribute("data-category", story.category);

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = `${legend.region[story.region]} · ${legend.category[story.category]}`;

  const headline = document.createElement("h3");
  headline.className = "headline";
  headline.textContent = story.headline;

  const subhead = document.createElement("p");
  subhead.className = "subhead";
  subhead.textContent = story.subhead;

  const body = document.createElement("p");
  body.className = "body";
  body.textContent = story.body;

  node.appendChild(meta);
  node.appendChild(headline);
  node.appendChild(subhead);
  node.appendChild(body);
  return node;
}

function renderLead(lead, legend) {
  const host = $("#lead-story");
  host.innerHTML = "";
  if (!lead) return;
  const tag = document.createElement("div");
  tag.className = "lead-tag";
  tag.textContent = "本日 の 主見出し";
  const meta = document.createElement("div");
  meta.className = "lead-meta";
  meta.textContent = `${legend.region[lead.region]} · ${legend.category[lead.category]}`;
  const h = document.createElement("h2");
  h.className = "lead-headline";
  h.textContent = lead.headline;
  const sub = document.createElement("p");
  sub.className = "lead-subhead";
  sub.textContent = lead.subhead;
  const body = document.createElement("p");
  body.className = "lead-body";
  body.textContent = lead.body;
  host.appendChild(tag);
  host.appendChild(meta);
  host.appendChild(h);
  host.appendChild(sub);
  host.appendChild(body);
}

function renderColumn(hostSel, stories, legend) {
  const host = $(hostSel);
  host.innerHTML = "";
  for (const s of stories) host.appendChild(renderStoryNode(s, legend));
}

async function loadFor(date) {
  if (!window.choukan) {
    $("#header-date").textContent = "Electron 経由 で 起動 して ください";
    return;
  }
  const iso = date.toISOString().slice(0, 10);
  const payload = await window.choukan.forDate(iso);
  $("#header-date").textContent = payload.header;
  $("#iso-date").textContent    = payload.isoDate;
  renderLead(payload.lead, payload.legend);
  renderColumn("#col-mid",   payload.columns[0], payload.legend);
  renderColumn("#col-right", payload.columns[1], payload.legend);
}

function bind() {
  $("#prev").addEventListener("click", () => {
    currentDate = new Date(currentDate.getTime() - 86_400_000);
    loadFor(currentDate);
  });
  $("#next").addEventListener("click", () => {
    currentDate = new Date(currentDate.getTime() + 86_400_000);
    loadFor(currentDate);
  });
  $("#today").addEventListener("click", () => {
    currentDate = new Date();
    loadFor(currentDate);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")  $("#prev").click();
    if (e.key === "ArrowRight") $("#next").click();
    if (e.key === "t" || e.key === "T") $("#today").click();
  });
}

bind();
loadFor(currentDate);
