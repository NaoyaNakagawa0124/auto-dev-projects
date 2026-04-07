const express = require('express');
const path = require('path');
const { readData, writeData, generateId } = require('./lib/storage');
const { ROOM_TYPES, AGE_GROUPS, getHazardsForRoom, calculateRoomScore, calculateOverallScore, getPriorityActions } = require('./lib/hazards');

const app = express();
const PORT = process.env.PORT || 3847;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Meta endpoints ──
app.get('/api/room-types', (req, res) => {
  res.json(ROOM_TYPES);
});

app.get('/api/age-groups', (req, res) => {
  res.json(AGE_GROUPS);
});

// ── Homes CRUD ──
app.get('/api/homes', (req, res) => {
  const data = readData();
  res.json(data.homes);
});

app.post('/api/homes', (req, res) => {
  const data = readData();
  const home = {
    id: generateId(),
    name: req.body.name || '我が家',
    ageGroup: req.body.ageGroup || '0-1',
    rooms: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.homes.push(home);
  writeData(data);
  res.status(201).json(home);
});

app.get('/api/homes/:homeId', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });
  res.json(home);
});

app.put('/api/homes/:homeId', (req, res) => {
  const data = readData();
  const idx = data.homes.findIndex(h => h.id === req.params.homeId);
  if (idx === -1) return res.status(404).json({ error: 'ホームが見つかりません' });
  const allowed = ['name', 'ageGroup'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) data.homes[idx][key] = req.body[key];
  }
  data.homes[idx].updatedAt = new Date().toISOString();
  writeData(data);
  res.json(data.homes[idx]);
});

app.delete('/api/homes/:homeId', (req, res) => {
  const data = readData();
  const idx = data.homes.findIndex(h => h.id === req.params.homeId);
  if (idx === -1) return res.status(404).json({ error: 'ホームが見つかりません' });
  data.homes.splice(idx, 1);
  writeData(data);
  res.status(204).end();
});

// ── Rooms CRUD ──
app.get('/api/homes/:homeId/rooms', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });
  res.json(home.rooms);
});

app.post('/api/homes/:homeId/rooms', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });

  const roomType = req.body.type || 'living';
  const roomInfo = ROOM_TYPES.find(r => r.id === roomType);
  const hazardTemplates = getHazardsForRoom(roomType, home.ageGroup);

  const room = {
    id: generateId(),
    type: roomType,
    name: req.body.name || (roomInfo ? roomInfo.name : roomType),
    x: req.body.x || 0,
    y: req.body.y || 0,
    w: req.body.w || 2,
    h: req.body.h || 2,
    hazards: hazardTemplates.map(h => ({
      id: generateId(),
      text: h.text,
      priority: h.priority,
      checked: false,
    })),
  };

  home.rooms.push(room);
  home.updatedAt = new Date().toISOString();
  writeData(data);
  res.status(201).json(room);
});

app.put('/api/homes/:homeId/rooms/:roomId', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });
  const room = home.rooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: '部屋が見つかりません' });

  const allowed = ['name', 'x', 'y', 'w', 'h'];
  for (const key of allowed) {
    if (req.body[key] !== undefined) room[key] = req.body[key];
  }
  home.updatedAt = new Date().toISOString();
  writeData(data);
  res.json(room);
});

app.delete('/api/homes/:homeId/rooms/:roomId', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });
  const idx = home.rooms.findIndex(r => r.id === req.params.roomId);
  if (idx === -1) return res.status(404).json({ error: '部屋が見つかりません' });
  home.rooms.splice(idx, 1);
  home.updatedAt = new Date().toISOString();
  writeData(data);
  res.status(204).end();
});

// ── Hazards ──
app.put('/api/homes/:homeId/rooms/:roomId/hazards/:hazardId', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });
  const room = home.rooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: '部屋が見つかりません' });
  const hazard = room.hazards.find(h => h.id === req.params.hazardId);
  if (!hazard) return res.status(404).json({ error: 'ハザードが見つかりません' });

  if (req.body.checked !== undefined) hazard.checked = req.body.checked;
  if (req.body.text !== undefined) hazard.text = req.body.text;
  home.updatedAt = new Date().toISOString();
  writeData(data);
  res.json(hazard);
});

// ── Refresh hazards for a room (when age group changes) ──
app.post('/api/homes/:homeId/rooms/:roomId/refresh-hazards', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });
  const room = home.rooms.find(r => r.id === req.params.roomId);
  if (!room) return res.status(404).json({ error: '部屋が見つかりません' });

  const hazardTemplates = getHazardsForRoom(room.type, home.ageGroup);
  room.hazards = hazardTemplates.map(h => ({
    id: generateId(),
    text: h.text,
    priority: h.priority,
    checked: false,
  }));
  home.updatedAt = new Date().toISOString();
  writeData(data);
  res.json(room);
});

// ── Dashboard / Scores ──
app.get('/api/homes/:homeId/dashboard', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });

  const roomScores = home.rooms.map(room => {
    const roomType = ROOM_TYPES.find(r => r.id === room.type);
    return {
      id: room.id,
      name: room.name,
      type: room.type,
      icon: roomType ? roomType.icon : '🏠',
      score: calculateRoomScore(room.hazards),
      totalHazards: room.hazards.length,
      checkedHazards: room.hazards.filter(h => h.checked).length,
    };
  });

  const overallScore = calculateOverallScore(home.rooms);
  const priorityActions = getPriorityActions(home.rooms);

  let totalHazards = 0;
  let checkedHazards = 0;
  for (const room of home.rooms) {
    totalHazards += room.hazards.length;
    checkedHazards += room.hazards.filter(h => h.checked).length;
  }

  res.json({
    overallScore,
    totalHazards,
    checkedHazards,
    completionRate: totalHazards === 0 ? 100 : Math.round((checkedHazards / totalHazards) * 100),
    roomScores,
    priorityActions,
  });
});

// ── Quick Check (5分チェック) ──
app.get('/api/homes/:homeId/quick-check', (req, res) => {
  const data = readData();
  const home = data.homes.find(h => h.id === req.params.homeId);
  if (!home) return res.status(404).json({ error: 'ホームが見つかりません' });

  // Get the top unchecked high-priority items across all rooms
  const items = getPriorityActions(home.rooms, 10);
  res.json(items);
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🏠 mamorima server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
