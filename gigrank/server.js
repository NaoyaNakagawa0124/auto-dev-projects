/**
 * GigRank - Express + WebSocket server.
 */

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
const path = require("path");
const db = require("./lib/database");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize database
db.getDb();

// ===== WebSocket =====
const groupClients = new Map(); // groupId -> Set<ws>

wss.on("connection", (ws) => {
  ws.groupId = null;

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw);
      if (msg.type === "join_group" && msg.groupId) {
        ws.groupId = msg.groupId;
        if (!groupClients.has(msg.groupId)) {
          groupClients.set(msg.groupId, new Set());
        }
        groupClients.get(msg.groupId).add(ws);
      }
    } catch {}
  });

  ws.on("close", () => {
    if (ws.groupId && groupClients.has(ws.groupId)) {
      groupClients.get(ws.groupId).delete(ws);
    }
  });
});

function broadcastToGroup(groupId, data) {
  const clients = groupClients.get(groupId);
  if (!clients) return;
  const message = JSON.stringify(data);
  for (const ws of clients) {
    if (ws.readyState === 1) ws.send(message);
  }
}

// ===== API Routes =====

// Create group
app.post("/api/groups", (req, res) => {
  const { name, username } = req.body;
  if (!name || !username) return res.status(400).json({ error: "Name and username required" });

  const group = db.createGroup(name);
  db.addMember(group.id, username);

  res.json({ group, joined: true });
});

// Join group
app.post("/api/groups/join", (req, res) => {
  const { joinCode, username } = req.body;
  if (!joinCode || !username) return res.status(400).json({ error: "Join code and username required" });

  const group = db.getGroupByCode(joinCode.toUpperCase());
  if (!group) return res.status(404).json({ error: "Group not found" });

  db.addMember(group.id, username);

  broadcastToGroup(group.id, { type: "member_joined", username });

  res.json({ group, joined: true });
});

// Get group details
app.get("/api/groups/:id", (req, res) => {
  const group = db.getGroup(req.params.id);
  if (!group) return res.status(404).json({ error: "Group not found" });

  const members = db.getMembers(group.id);
  const gigs = db.getGigsByGroup(group.id);

  res.json({ group, members, gigs });
});

// Add gig
app.post("/api/groups/:id/gigs", (req, res) => {
  const { artist, venue, date, username } = req.body;
  if (!artist || !venue || !date || !username) {
    return res.status(400).json({ error: "Artist, venue, date, and username required" });
  }

  const gig = db.createGig(req.params.id, artist, venue, date, username);
  broadcastToGroup(req.params.id, { type: "gig_added", gig });

  res.json({ gig });
});

// Rate a gig
app.post("/api/gigs/:id/rate", (req, res) => {
  const { username, energy, sound, setlist, crowd, vibes, comment } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });

  const scores = { energy, sound, setlist, crowd, vibes };
  for (const [key, val] of Object.entries(scores)) {
    if (!Number.isInteger(val) || val < 1 || val > 10) {
      return res.status(400).json({ error: `${key} must be 1-10` });
    }
  }

  db.addRating(req.params.id, username, scores, comment);

  const ratings = db.getRatingsForGig(req.params.id);
  const averages = db.getAverageRatings(req.params.id);

  const gig = db.getGig(req.params.id);
  if (gig) {
    broadcastToGroup(gig.group_id, { type: "rating_updated", gigId: req.params.id, ratings, averages });
  }

  res.json({ ratings, averages });
});

// Get gig ratings
app.get("/api/gigs/:id/ratings", (req, res) => {
  const ratings = db.getRatingsForGig(req.params.id);
  const averages = db.getAverageRatings(req.params.id);
  res.json({ ratings, averages });
});

// ===== Start =====
const PORT = process.env.PORT || 3000;

function start() {
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`GigRank running at http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  start();
}

module.exports = { app, server, start, wss };
