// Canvas renderer for crime scene investigation
// Draws procedural scenes with clickable hotspots

export function drawScene(ctx, caseData, foundClueIds, hoveredClue) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;

  // Background
  ctx.fillStyle = caseData.scene.bg;
  ctx.fillRect(0, 0, w, h);

  // Draw ambient grid (noir effect)
  ctx.strokeStyle = 'rgba(100, 120, 180, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw scene objects
  caseData.scene.objects.forEach(obj => {
    ctx.fillStyle = obj.color;
    if (obj.type === 'rect') {
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = 'rgba(200, 200, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
    } else if (obj.type === 'circle') {
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = 'rgba(200, 200, 230, 0.4)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const lx = obj.type === 'circle' ? obj.x : obj.x + (obj.w || 0) / 2;
    const ly = obj.type === 'circle' ? obj.y + (obj.r || 0) + 14 : obj.y + (obj.h || 0) + 14;
    ctx.fillText(obj.label, lx, ly);
  });

  // Draw clue hotspots
  caseData.clues.forEach(clue => {
    const isFound = foundClueIds.includes(clue.id);
    const isHovered = hoveredClue === clue.id;
    const loc = clue.location;

    if (isFound) {
      // Revealed clue - green glow
      ctx.strokeStyle = 'rgba(76, 255, 142, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(loc.x, loc.y, loc.w, loc.h);
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = 'rgba(76, 255, 142, 0.9)';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`✓ ${clue.name}`, loc.x, loc.y - 4);
    } else if (isHovered) {
      // Hover highlight - pulse
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(loc.x - 2, loc.y - 2, loc.w + 4, loc.h + 4);

      // Magnifying glass icon
      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔍', loc.x + loc.w / 2, loc.y - 6);
    }
  });

  // Vignette effect
  const gradient = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.7);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);
}

export function getClueAtPosition(caseData, x, y) {
  for (const clue of caseData.clues) {
    const loc = clue.location;
    if (x >= loc.x && x <= loc.x + loc.w && y >= loc.y && y <= loc.y + loc.h) {
      return clue;
    }
  }
  return null;
}

export function drawClueDetail(ctx, clue, w, h) {
  // Overlay for clue detail view
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, w, h);

  // Detail panel
  const px = w * 0.1;
  const py = h * 0.15;
  const pw = w * 0.8;
  const ph = h * 0.7;

  ctx.fillStyle = 'rgba(20, 20, 40, 0.95)';
  ctx.fillRect(px, py, pw, ph);
  ctx.strokeStyle = 'rgba(108, 140, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(px, py, pw, ph);

  // Title
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`🔍 ${clue.name}`, w / 2, py + 40);

  // Description
  ctx.fillStyle = '#e0e0ff';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';

  // Word wrap
  const words = clue.description.split('');
  let line = '';
  let y = py + 80;
  const maxWidth = pw - 40;

  for (const char of words) {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, w / 2, y);
      line = char;
      y += 24;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, w / 2, y);

  // Close hint
  ctx.fillStyle = 'rgba(160, 160, 200, 0.5)';
  ctx.font = '14px sans-serif';
  ctx.fillText('クリックで閉じる', w / 2, py + ph - 20);
}
