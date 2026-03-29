/**
 * ChromaDrip — Bun HTTP server serving the palette API and web UI.
 */

import { generatePalette, MOODS, SEASONS, FABRICS, getMoodEmoji, getCurrentSeason } from "./palette";
import type { Mood, Season, FabricType } from "./palette";

const PORT = 3035;

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ChromaDrip — 2035 Fashion Palettes</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'SF Mono', monospace; background: #0a0a12; color: #e0e0f0; min-height: 100vh; }
.header { text-align: center; padding: 32px 16px 16px; }
.header h1 { font-size: 36px; background: linear-gradient(90deg, #ff00ff, #00ffff, #ff6600); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 3px; }
.header .year { font-size: 12px; color: #555; letter-spacing: 4px; }
.controls { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; padding: 16px; max-width: 700px; margin: 0 auto; }
.control-group { display: flex; flex-direction: column; gap: 4px; }
.control-group label { font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
.control-group select { background: #1a1a2e; color: #e0e0f0; border: 1px solid #333; padding: 10px 16px; border-radius: 8px; font-size: 14px; font-family: inherit; }
.generate-btn { background: linear-gradient(135deg, #ff00ff, #00ffff); color: #000; border: none; padding: 12px 32px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; letter-spacing: 1px; margin: 16px auto; display: block; }
.palette-card { max-width: 700px; margin: 0 auto; padding: 24px; }
.palette-name { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.palette-desc { font-size: 13px; color: #888; margin-bottom: 20px; line-height: 1.5; }
.colors { display: flex; gap: 12px; margin-bottom: 20px; }
.color-swatch { flex: 1; border-radius: 12px; padding: 20px 12px; text-align: center; min-height: 120px; display: flex; flex-direction: column; justify-content: flex-end; gap: 6px; position: relative; overflow: hidden; }
.color-swatch .glow-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 12px; pointer-events: none; }
.color-name { font-size: 11px; font-weight: 600; opacity: 0.9; }
.color-hex { font-size: 13px; font-family: monospace; opacity: 0.7; cursor: pointer; }
.color-glow { font-size: 10px; opacity: 0.6; }
.export { text-align: center; }
.export button { background: #1a1a2e; color: #aaa; border: 1px solid #333; padding: 8px 20px; border-radius: 6px; font-size: 12px; cursor: pointer; margin: 4px; }
.footer { text-align: center; padding: 40px; font-size: 11px; color: #333; }
</style>
</head>
<body>
<div class="header">
  <div class="year">/// YEAR 2035 ///</div>
  <h1>CHROMADRIP</h1>
  <div class="year">SMART FABRIC PALETTE GENERATOR</div>
</div>

<div class="controls">
  <div class="control-group">
    <label>Mood</label>
    <select id="mood">${MOODS.map(m => '<option value="' + m + '">' + getMoodEmoji(m) + ' ' + m + '</option>').join('')}</select>
  </div>
  <div class="control-group">
    <label>Season</label>
    <select id="season">${SEASONS.map(s => '<option value="' + s + '"' + (s === getCurrentSeason() ? ' selected' : '') + '>' + s + '</option>').join('')}</select>
  </div>
  <div class="control-group">
    <label>Fabric</label>
    <select id="fabric">${FABRICS.map(f => '<option value="' + f + '">' + f.replace('_', ' ') + '</option>').join('')}</select>
  </div>
</div>

<button class="generate-btn" id="gen">GENERATE PALETTE</button>

<div class="palette-card" id="result"></div>

<div class="footer">ChromaDrip v0.1.0 — Powering fashion since 2035 — Bun runtime</div>

<script>
document.getElementById('gen').addEventListener('click', async () => {
  const mood = document.getElementById('mood').value;
  const season = document.getElementById('season').value;
  const fabric = document.getElementById('fabric').value;
  const hour = new Date().getHours();
  const res = await fetch('/api/palette?mood='+mood+'&season='+season+'&fabric='+fabric+'&hour='+hour);
  const p = await res.json();
  const el = document.getElementById('result');
  el.innerHTML = '<div class="palette-name">' + p.name + '</div>' +
    '<div class="palette-desc">' + p.description + '</div>' +
    '<div class="colors">' + p.colors.map(c =>
      '<div class="color-swatch" style="background:'+c.hex+';color:'+(brightness(c.r,c.g,c.b)>128?'#000':'#fff')+'">' +
      '<div class="glow-overlay" style="box-shadow:inset 0 0 '+(c.glow*40)+'px '+(c.glow*20)+'px rgba(255,255,255,'+(c.glow*0.3)+')"></div>' +
      '<div class="color-name">'+c.name+'</div>' +
      '<div class="color-hex" onclick="navigator.clipboard.writeText(\\''+c.hex+'\\')">'+c.hex+'</div>' +
      '<div class="color-glow">glow: '+(c.glow*100).toFixed(0)+'%</div></div>'
    ).join('') + '</div>' +
    '<div class="export"><button onclick="navigator.clipboard.writeText(JSON.stringify('+JSON.stringify(p.colors).replace(/"/g,'&quot;')+'))">Copy JSON</button></div>';
});
document.getElementById('gen').click();
function brightness(r,g,b){return(r*299+g*587+b*114)/1000;}
</script>
</body>
</html>`;

const server = Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/palette") {
      const mood = (url.searchParams.get("mood") || "serene") as Mood;
      const season = (url.searchParams.get("season") || getCurrentSeason()) as Season;
      const fabric = (url.searchParams.get("fabric") || "neon_mesh") as FabricType;
      const hour = parseInt(url.searchParams.get("hour") || String(new Date().getHours()));

      if (!MOODS.includes(mood)) return new Response("Invalid mood", { status: 400 });
      if (!SEASONS.includes(season)) return new Response("Invalid season", { status: 400 });
      if (!FABRICS.includes(fabric)) return new Response("Invalid fabric", { status: 400 });

      const palette = generatePalette(mood, season, hour, fabric);
      return Response.json(palette);
    }

    return new Response(HTML, { headers: { "Content-Type": "text/html" } });
  },
});

console.log(\`ChromaDrip running at http://localhost:\${PORT} — Year 2035\`);
