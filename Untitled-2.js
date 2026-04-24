// ---------------- CANVAS ----------------
const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const centerX = Math.floor(WIDTH / 2);
const centerY = Math.floor(HEIGHT / 2);

const R = 200;

// actualizar info en pantalla
document.getElementById("infoCenter").textContent = `(${centerX}, ${centerY})`;
document.getElementById("infoStatus").textContent = "Dibujando...";

// ---------------- PIXEL ----------------
function drawPixel(x, y, color = "#00d4ff") {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
}

// ---------------- BRESENHAM ----------------
function bresenhamLine(x0, y0, x1, y1, color = "#ffffff") {

  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);

  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;

  let err = dx - dy;

  while (true) {
    drawPixel(x0, y0, color);

    if (x0 === x1 && y0 === y1) break;

    let e2 = 2 * err;

    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }

    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
}

// ---------------- CIRCULO ----------------
function drawCircle(cx, cy, r, color = "#ff6b35") {

  cx = Math.round(cx);
  cy = Math.round(cy);

  let x = 0;
  let y = Math.round(r);
  let p = 1 - y;

  while (x <= y) {

    drawPixel(cx + x, cy + y, color);
    drawPixel(cx - x, cy + y, color);
    drawPixel(cx + x, cy - y, color);
    drawPixel(cx - x, cy - y, color);

    drawPixel(cx + y, cy + x, color);
    drawPixel(cx - y, cy + x, color);
    drawPixel(cx + y, cy - x, color);
    drawPixel(cx - y, cy - x, color);

    x++;

    if (p < 0) {
      p += 2 * x + 1;
    } else {
      y--;
      p += 2 * (x - y) + 1;
    }
  }
}

// ---------------- POLIGONO ----------------
function getPolygonVertices(cx, cy, sides, radius) {
  const vertices = [];

  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides;

    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    vertices.push({ x, y });
  }

  return vertices;
}

// ---------------- ESCENA ----------------
function drawScene() {

  ctx.fillStyle = '#0d1526';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const n = Math.floor(Math.random() * 6) + 5;

  const vertices = getPolygonVertices(centerX, centerY, n, R);

  // dibujar polígono
  for (let i = 0; i < n; i++) {
    let v0 = vertices[i];
    let v1 = vertices[(i + 1) % n];

    bresenhamLine(v0.x, v0.y, v1.x, v1.y, "#00d4ff");
  }

  // círculos en vértices
  for (let v of vertices) {
    drawCircle(v.x, v.y, R / 4, "#ff6b35");
  }

  document.getElementById("infoStatus").textContent = `Polígono de ${n} lados generado`;
}

// ---------------- EJECUCION ----------------
window.onload = drawScene;