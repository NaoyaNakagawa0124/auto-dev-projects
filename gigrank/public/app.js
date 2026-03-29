// GigRank - Frontend Application

let state = {
  groupId: null,
  username: null,
  currentGigId: null,
};

let ws = null;
let radarChart = null;

const DIMENSIONS = ["energy", "sound", "setlist", "crowd", "vibes"];
const DIM_LABELS = ["Energy", "Sound", "Setlist", "Crowd", "Vibes"];
const COLORS = ["#ff4444", "#ff8800", "#ffcc00", "#00ddaa", "#4488ff", "#aa44ff", "#ff44aa"];

// ===== API Helpers =====
async function api(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`/api${path}`, opts);
  return res.json();
}

// ===== WebSocket =====
function connectWS() {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(`${protocol}//${location.host}`);
  ws.onopen = () => {
    if (state.groupId) {
      ws.send(JSON.stringify({ type: "join_group", groupId: state.groupId }));
    }
  };
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    handleWSMessage(msg);
  };
  ws.onclose = () => setTimeout(connectWS, 3000);
}

function handleWSMessage(msg) {
  switch (msg.type) {
    case "member_joined":
      showToast(`${msg.username} joined the group!`);
      loadGroupData();
      break;
    case "gig_added":
      showToast(`New gig added: ${msg.gig.artist}`);
      loadGroupData();
      break;
    case "rating_updated":
      if (state.currentGigId === msg.gigId) {
        renderRatings(msg.ratings, msg.averages);
      }
      break;
  }
}

// ===== Group Actions =====
async function createGroup() {
  const name = document.getElementById("create-name").value.trim();
  const username = document.getElementById("create-username").value.trim();
  if (!name || !username) return showToast("Fill in all fields");

  const data = await api("POST", "/groups", { name, username });
  if (data.error) return showToast(data.error);

  state.groupId = data.group.id;
  state.username = username;
  connectWS();
  showDashboard();
}

async function joinGroup() {
  const joinCode = document.getElementById("join-code").value.trim().toUpperCase();
  const username = document.getElementById("join-username").value.trim();
  if (!joinCode || !username) return showToast("Fill in all fields");

  const data = await api("POST", "/groups/join", { joinCode, username });
  if (data.error) return showToast(data.error);

  state.groupId = data.group.id;
  state.username = username;
  connectWS();
  showDashboard();
}

async function loadGroupData() {
  if (!state.groupId) return;
  const data = await api("GET", `/groups/${state.groupId}`);
  if (data.error) return;

  document.getElementById("group-name").textContent = data.group.name;
  document.getElementById("group-code").textContent = data.group.join_code;

  const membersEl = document.getElementById("members");
  membersEl.innerHTML = data.members
    .map((m) => `<span class="member-tag">${m.username}</span>`)
    .join("");

  const gigsEl = document.getElementById("gigs-list");
  if (data.gigs.length === 0) {
    gigsEl.innerHTML = '<h2 style="margin:24px 0 12px">Gigs</h2><p style="color:#666">No gigs yet. Add one above!</p>';
  } else {
    gigsEl.innerHTML =
      '<h2 style="margin:24px 0 12px">Gigs</h2>' +
      data.gigs
        .map(
          (g) => `
        <div class="gig-card" onclick="showGigDetail('${g.id}')">
          <span class="artist">${g.artist}</span>
          <span class="venue">${g.venue} &middot; ${g.gig_date}</span>
        </div>`
        )
        .join("");
  }
}

async function addGig() {
  const artist = document.getElementById("gig-artist").value.trim();
  const venue = document.getElementById("gig-venue").value.trim();
  const date = document.getElementById("gig-date").value;
  if (!artist || !venue || !date) return showToast("Fill in all fields");

  await api("POST", `/groups/${state.groupId}/gigs`, { artist, venue, date, username: state.username });
  document.getElementById("gig-artist").value = "";
  document.getElementById("gig-venue").value = "";
  document.getElementById("gig-date").value = "";
  loadGroupData();
}

// ===== Gig Detail =====
async function showGigDetail(gigId) {
  state.currentGigId = gigId;
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("gig-detail").classList.remove("hidden");

  // Fetch gig info from the gigs list (already loaded)
  const data = await api("GET", `/groups/${state.groupId}`);
  const gig = data.gigs.find((g) => g.id === gigId);
  if (gig) {
    document.getElementById("detail-artist").textContent = gig.artist;
    document.getElementById("detail-venue").textContent = gig.venue;
    document.getElementById("detail-date").textContent = gig.gig_date;
  }

  // Build rating sliders
  const slidersEl = document.getElementById("rating-sliders");
  slidersEl.innerHTML = DIMENSIONS.map(
    (dim, i) => `
    <div class="slider-group">
      <div class="slider-label">
        <span>${DIM_LABELS[i]}</span>
        <span class="value" id="val-${dim}">5</span>
      </div>
      <input type="range" min="1" max="10" value="5" id="slider-${dim}"
             oninput="document.getElementById('val-${dim}').textContent=this.value">
    </div>`
  ).join("");

  // Load existing ratings
  const ratingsData = await api("GET", `/gigs/${gigId}/ratings`);
  renderRatings(ratingsData.ratings, ratingsData.averages);
}

async function submitRating() {
  const scores = {};
  for (const dim of DIMENSIONS) {
    scores[dim] = parseInt(document.getElementById(`slider-${dim}`).value, 10);
  }
  const comment = document.getElementById("rating-comment").value.trim();

  const data = await api("POST", `/gigs/${state.currentGigId}/rate`, {
    username: state.username,
    ...scores,
    comment,
  });

  if (data.error) return showToast(data.error);
  renderRatings(data.ratings, data.averages);
  showToast("Rating submitted!");
}

function renderRatings(ratings, averages) {
  if (!ratings || ratings.length === 0) {
    document.getElementById("all-ratings").classList.add("hidden");
    return;
  }

  document.getElementById("all-ratings").classList.remove("hidden");

  // Render individual ratings
  const listEl = document.getElementById("ratings-list");
  listEl.innerHTML = ratings
    .map(
      (r) => `
    <div style="padding:8px 0;border-bottom:1px solid #222">
      <strong>${r.username}</strong>
      <span style="color:#888;font-size:12px;margin-left:8px">
        E:${r.energy} S:${r.sound} SL:${r.setlist} C:${r.crowd} V:${r.vibes}
      </span>
      ${r.comment ? `<p style="color:#aaa;font-size:13px;margin-top:4px">"${r.comment}"</p>` : ""}
    </div>`
    )
    .join("");

  // Update radar chart
  updateRadarChart(ratings, averages);
}

function updateRadarChart(ratings, averages) {
  const ctx = document.getElementById("radar-chart").getContext("2d");

  const datasets = ratings.map((r, i) => ({
    label: r.username,
    data: [r.energy, r.sound, r.setlist, r.crowd, r.vibes],
    borderColor: COLORS[i % COLORS.length],
    backgroundColor: COLORS[i % COLORS.length] + "20",
    borderWidth: 2,
    pointRadius: 4,
    pointBackgroundColor: COLORS[i % COLORS.length],
  }));

  if (averages && averages.count > 1) {
    datasets.push({
      label: "Average",
      data: [averages.energy, averages.sound, averages.setlist, averages.crowd, averages.vibes],
      borderColor: "#ffffff",
      backgroundColor: "rgba(255,255,255,0.05)",
      borderWidth: 3,
      borderDash: [5, 5],
      pointRadius: 0,
    });
  }

  if (radarChart) radarChart.destroy();
  radarChart = new Chart(ctx, {
    type: "radar",
    data: { labels: DIM_LABELS, datasets },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 10,
          ticks: { color: "#666", backdropColor: "transparent" },
          grid: { color: "#222" },
          angleLines: { color: "#222" },
          pointLabels: { color: "#aaa", font: { size: 13 } },
        },
      },
      plugins: {
        legend: { labels: { color: "#aaa", font: { size: 12 } } },
      },
    },
  });
}

// ===== Navigation =====
function showDashboard() {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("gig-detail").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  state.currentGigId = null;
  loadGroupData();
}

// ===== Toast =====
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3000);
}
