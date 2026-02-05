// ===== 1. SVG POINTS (tvoja pot) =====
const svgPoints = `
234,2 234,10 298,10 298,26 250,26 250,42 266,42 266,58 250,58 250,74
266,74 266,90 250,90 250,106 282,106 282,122 314,122 314,90
346,90 346,106 330,106 330,138 218,138 218,170 250,170 250,186
218,186 218,202 282,202 282,218 266,218 266,266 282,266 282,250
298,250 298,234 314,234 314,266 298,266 298,282 282,282 282,298
298,298 298,314 330,314 330,346 298,346 298,330 282,330 282,362
298,362 298,378 282,378 282,394 218,394 218,346 234,346 234,362
266,362 266,314 234,314 234,330 218,330 218,314 202,314 202,298
170,298 170,266 154,266 154,282 122,282 122,250 74,250 74,218
58,218 58,202 26,202 26,218 10,218 10,250 42,250 42,266
10,266 10,314 26,314 26,330 42,330 42,314 74,314 74,346
58,346 58,394 42,394 42,346 10,346 10,394 26,394 26,426
42,426 42,410 58,410 58,442 74,442 74,426 90,426 90,442
106,442 106,458 138,458 138,442 170,442 170,426 234,426
234,458 250,458 250,442 298,442 298,474 250,474 250,482
`;

// ===== 2. PRETVORBA SVG → CANVAS FORMAT =====
const points = svgPoints
  .trim()
  .split(/\s+/)
  .flatMap(p => p.split(',').map(Number));


// ===== 3. CANVAS SETUP =====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.lineWidth = 2;
ctx.strokeStyle = "#ffffff";
ctx.lineCap = "round";
ctx.shadowColor = "black";
ctx.shadowBlur = 3;


// ===== 4. NASTAVITVE ANIMACIJE =====
let steps = 10;        // smoothness
let speed = 4;         // hitrost med segmenti
let step = 0;
let i = 0;
let shown = false;


// ===== 5. INTERPOLACIJA =====
function interpolate(x1, y1, x2, y2, step) {
  return {
    x: x1 + ((x2 - x1) / steps) * step,
    y: y1 + ((y2 - y1) / steps) * step
  };
}


// ===== 6. ANIMACIJA RISANJA =====
function animateDrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  i = 0;
  shown = true;

  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);

  function drawLine() {
    if (!shown || i >= points.length / 2 - 1) return;

    const x1 = points[i * 2];
    const y1 = points[i * 2 + 1];
    const x2 = points[(i + 1) * 2];
    const y2 = points[(i + 1) * 2 + 1];

    step = 0;

    function drawSmooth() {
      if (!shown) return;

      if (step <= steps) {
        const { x, y } = interpolate(x1, y1, x2, y2, step);
        ctx.lineTo(x, y);
        ctx.stroke();
        step++;
        requestAnimationFrame(drawSmooth);
      } else {
        i++;
        setTimeout(drawLine, speed);
      }
    }

    drawSmooth();
  }

  drawLine();
}


// ===== 7. RESET =====
function reset() {
  shown = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}


// ===== 8. GUMBI =====
document.getElementById("gumb").addEventListener("click", animateDrawing);
document.getElementById("gumb2").addEventListener("click", reset);
