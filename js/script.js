// =====================
// Konfiguracija
// =====================
const COLS = 25;
const ROWS = 25;
const WALL = 1;
const FLOOR = 0;

const BANANA_COUNT = 6;
const SHOW_GRID = false;

// =====================
// DOM
// =====================
const gameEl = document.getElementById("game");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const hudBananas = document.getElementById("banane");
const hudMoves = document.getElementById("koraki");

const btnNew = document.getElementById("nov");
const btnSolve = document.getElementById("resi");
const btnReset = document.getElementById("reset");

// =====================
// Stanje igre
// =====================
let grid = [];
let start = { x: 1, y: 1 };
let end = { x: COLS - 2, y: ROWS - 2 };
let player = { ...start };
let bananas = [];
let bananasGot = 0;
let moves = 0;

let solution = [];
let showSolution = false;

// canvas “logične” (CSS) dimenzije
let cw = 720;
let ch = 720;


function redrawNow() {
  // prisilni repaint canvasa v istem frame-u
  ctx.save();
  ctx.restore();
  draw();
}


// =====================
// Pomožne funkcije
// =====================
function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < COLS && y < ROWS;
}
function key(x, y) { return `${x},${y}`; }
function shuffle(a){
  for (let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function updateHUD() {
  hudBananas.textContent = `🍌 ${bananasGot}/${bananas.length}`;
  hudMoves.textContent = `Koraki: ${moves}`;
}

// =====================
// Generiranje labirinta (DFS carving)
// =====================
function generateMaze() {
  grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => WALL));

  const visited = new Set();
  const stack = [];

  function carve(x, y) {
    grid[y][x] = FLOOR;
    visited.add(key(x,y));
  }

  function neighbors(x, y) {
    const dirs = shuffle([
      {dx: 2, dy: 0},
      {dx:-2, dy: 0},
      {dx: 0, dy: 2},
      {dx: 0, dy:-2},
    ]);
    const res = [];
    for (const d of dirs) {
      const nx = x + d.dx, ny = y + d.dy;
      if (inBounds(nx, ny) && nx % 2 === 1 && ny % 2 === 1 && !visited.has(key(nx,ny))) {
        res.push({nx, ny, wx: x + d.dx/2, wy: y + d.dy/2});
      }
    }
    return res;
  }

  carve(1,1);
  stack.push({x:1,y:1});

  while (stack.length) {
    const cur = stack[stack.length - 1];
    const nbs = neighbors(cur.x, cur.y);
    if (nbs.length === 0) { stack.pop(); continue; }
    const pick = nbs[0];
    grid[pick.wy][pick.wx] = FLOOR;
    carve(pick.nx, pick.ny);
    stack.push({x: pick.nx, y: pick.ny});
  }

  start = { x: 1, y: 1 };
  end = { x: COLS - 2, y: ROWS - 2 };
  grid[start.y][start.x] = FLOOR;
  grid[end.y][end.x] = FLOOR;

  player = { ...start };
  moves = 0;
  showSolution = false;
  solution = [];

  spawnBananas(BANANA_COUNT);
  bananasGot = 0;

  updateHUD();
}

// =====================
// Banane
// =====================
function spawnBananas(count) {
  bananas = [];
  const taken = new Set([key(start.x,start.y), key(end.x,end.y)]);
  let tries = 0;

  while (bananas.length < count && tries < 50000) {
    tries++;
    const x = 1 + Math.floor(Math.random() * (COLS - 2));
    const y = 1 + Math.floor(Math.random() * (ROWS - 2));
    if (grid[y][x] === WALL) continue;
    const k = key(x,y);
    if (taken.has(k)) continue;
    taken.add(k);
    bananas.push({ x, y, got: false });
  }
}

function collectIfBanana() {
  for (const b of bananas) {
    if (!b.got && b.x === player.x && b.y === player.y) {
      b.got = true;
      bananasGot++;
      updateHUD();
      return;
    }
  }
}

// =====================
// BFS rešitev
// =====================
function bfs(from, to) {
  const W = COLS, H = ROWS;
  const N = W * H;

  const idx = (x, y) => y * W + x;

  const startI = idx(from.x, from.y);
  const goalI  = idx(to.x, to.y);

  // -1 pomeni "ni prejšnjega"
  const prev = new Int32Array(N);
  prev.fill(-1);

  const seen = new Uint8Array(N);

  // queue (max N)
  const q = new Int32Array(N);
  let head = 0, tail = 0;

  seen[startI] = 1;
  q[tail++] = startI;

  while (head < tail) {
    const cur = q[head++];
    if (cur === goalI) break;

    const x = cur % W;
    const y = (cur / W) | 0;

    // 4 smeri
    // desno
    if (x + 1 < W && grid[y][x + 1] !== WALL) {
      const ni = cur + 1;
      if (!seen[ni]) { seen[ni] = 1; prev[ni] = cur; q[tail++] = ni; }
    }
    // levo
    if (x - 1 >= 0 && grid[y][x - 1] !== WALL) {
      const ni = cur - 1;
      if (!seen[ni]) { seen[ni] = 1; prev[ni] = cur; q[tail++] = ni; }
    }
    // dol
    if (y + 1 < H && grid[y + 1][x] !== WALL) {
      const ni = cur + W;
      if (!seen[ni]) { seen[ni] = 1; prev[ni] = cur; q[tail++] = ni; }
    }
    // gor
    if (y - 1 >= 0 && grid[y - 1][x] !== WALL) {
      const ni = cur - W;
      if (!seen[ni]) { seen[ni] = 1; prev[ni] = cur; q[tail++] = ni; }
    }
  }

  if (!seen[goalI]) return [];

  // reconstruct (brez split)
  const path = [];
  let cur = goalI;
  while (cur !== -1) {
    const x = cur % W;
    const y = (cur / W) | 0;
    path.push({ x, y });
    if (cur === startI) break;
    cur = prev[cur];
  }
  path.reverse();
  return path;
}


// =====================
// Render (RIŠEMO V CSS DIMENZIJAH cw/ch)
// =====================
function draw() {
  const size = Math.min(cw, ch);
  const cell = size / COLS;

  ctx.clearRect(0, 0, cw, ch);

  // ozadje “plošče” da maze izstopa
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, 0, cw, ch);

  // maze
  for (let y=0; y<ROWS; y++) {
    for (let x=0; x<COLS; x++) {
      const px = x*cell, py = y*cell;

      if (grid[y][x] === WALL) {
        ctx.fillStyle = "rgba(10, 30, 20, 0.95)";
      } else {
        ctx.fillStyle = "rgba(60, 150, 80, 0.22)";
      }
      ctx.fillRect(px, py, cell, cell);

      if (SHOW_GRID) {
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.strokeRect(px, py, cell, cell);
      }
    }
  }

  // solution highlight
  if (showSolution && solution.length) {
    ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
    for (const p of solution) {
      ctx.fillRect(p.x*cell, p.y*cell, cell, cell);
    }
  }

  // target marker background
  ctx.fillStyle = "rgba(239, 68, 68, 0.97)";
  ctx.fillRect(end.x*cell, end.y*cell, cell, cell);

  // bananas
  for (const b of bananas) {
    if (b.got) continue;
    drawEmoji("🍌", b.x, b.y, cell);
  }

  // player
  drawEmoji("🐵", player.x, player.y, cell);

  // target emoji
  drawEmoji("🎯", end.x, end.y, cell);
}

function drawEmoji(emoji, x, y, cell) {
  const cxp = x*cell + cell/2;
  const cyp = y*cell + cell/2;
  ctx.font = `${Math.floor(cell*0.75)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(emoji, cxp, cyp);
}

// =====================
// Gameplay
// =====================
function tryMove(dx, dy) {
  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!inBounds(nx, ny)) return;
  if (grid[ny][nx] === WALL) return;

  player = { x: nx, y: ny };
  moves++;
  updateHUD();

  collectIfBanana();

  if (player.x === end.x && player.y === end.y) {
    if (bananasGot === bananas.length) {
          Swal.fire({
              title: 'Zmaga🎉',
              text: 'Pobral si vse banane',
              icon: 'success',
              confirmButtonText: 'V redu'
          });
    } else {
          Swal.fire({
              title: 'Napaka',
              text: 'Naprej poberi vse banane',
              icon: 'error',
              confirmButtonText: 'V redu'
          });
    }
  }

  draw();
}

// =====================
// Controls
// =====================
function onKey(e) {
  const keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
  if (!keys.includes(e.key)) return;
  e.preventDefault();

  if (e.key === "ArrowUp") tryMove(0,-1);
  if (e.key === "ArrowDown") tryMove(0, 1);
  if (e.key === "ArrowLeft") tryMove(-1,0);
  if (e.key === "ArrowRight") tryMove(1, 0);
}

btnNew.addEventListener("click", () => {
  generateMaze();
  draw();
  gameEl.focus();
});

btnReset.addEventListener("click", () => {
  player = { ...start };
  moves = 0;
  bananasGot = 0;
  bananas.forEach(b => b.got = false);
  showSolution = false;
  solution = [];
  updateHUD();
  draw();
  gameEl.focus();
});

btnSolve.addEventListener("click", () => {
  // toggle
  showSolution = !showSolution;

  if (showSolution) {
    solution = bfs(player, end);
  }
  redrawNow();   // 🔥 TAKOJ izriše
  gameEl.focus();
});

window.addEventListener("keydown", onKey);
gameEl.addEventListener("keydown", onKey);
gameEl.addEventListener("click", () => gameEl.focus());

// =====================
// DPR / Resize FIX (tukaj je bistvo popravka)
// =====================
function fitCanvasToDisplay() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  // CSS dimenzije (logične)
  cw = rect.width;
  ch = rect.height;

  // notranje dimenzije (device px)
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);

  // rišemo v CSS koordinatah
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// =====================
// Start
// =====================
function boot() {
  fitCanvasToDisplay();
  generateMaze();
  draw();
  gameEl.focus();
}

window.addEventListener("resize", () => {
  fitCanvasToDisplay();
  draw();
});

boot();


