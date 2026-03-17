const gameEl = document.getElementById("game");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const hudBananas = document.getElementById("banane");
const hudMoves = document.getElementById("koraki");

const btnNew = document.getElementById("nov");
const btnReset = document.getElementById("reset");
const vizitka = document.getElementById("vizitka");

const MAZE_SIZE = 404;
const BANANA_COUNT = 6;
const MOVING_BANANA_COUNT = 2;
const PLAYER_RADIUS = 4;
const PLAYER_SPEED = 110;
const MOVING_BANANA_SPEED = 34;
const START = { x: 202, y: 10 };
const GOAL = { x: 202, y: 394 };

const hitCanvas = document.createElement("canvas");
const hitCtx = hitCanvas.getContext("2d", { willReadFrequently: true });

// Shranjujemo stanje tipk, da lahko igralca premikamo gladko v vsaki animacijski sličici.
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

let cw = 720;
let ch = 720;
let viewSize = 720;
let offsetX = 0;
let offsetY = 0;
let scale = 1;
let player = { ...START };
let bananas = [];
let bananasGot = 0;
let lastTime = 0;

// canvas prilagodimo velikosti elementa in izračunamo merilo za pretvorbo koordinat labirinta na zaslon.
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  cw = rect.width;
  ch = rect.height;
  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  viewSize = Math.min(cw, ch);
  offsetX = (cw - viewSize) / 2;
  offsetY = (ch - viewSize) / 2;
  scale = viewSize / MAZE_SIZE;
}

function screenX(x) {
  return offsetX + x * scale;
}

function screenY(y) {
  return offsetY + y * scale;
}

// narisana celotna oblika labirinta: vse vodoravne in navpične stene.
function drawWalls(ctx, wallScale, wallOffsetX, wallOffsetY) {
  ctx.save();
  ctx.translate(wallOffsetX, wallOffsetY);
  ctx.scale(wallScale, wallScale);
  ctx.strokeStyle = "rgba(12, 24, 18, 0.98)";
  ctx.lineWidth = 2;
  ctx.lineCap = "square";
  ctx.beginPath();
  ctx.moveTo(2, 2);
  ctx.lineTo(194, 2);
  ctx.moveTo(210, 2);
  ctx.lineTo(402, 2);
  ctx.moveTo(18, 18);
  ctx.lineTo(66, 18);
  ctx.moveTo(98, 18);
  ctx.lineTo(130, 18);
  ctx.moveTo(162, 18);
  ctx.lineTo(178, 18);
  ctx.moveTo(242, 18);
  ctx.lineTo(258, 18);
  ctx.moveTo(290, 18);
  ctx.lineTo(338, 18);
  ctx.moveTo(50, 34);
  ctx.lineTo(66, 34);
  ctx.moveTo(98, 34);
  ctx.lineTo(162, 34);
  ctx.moveTo(194, 34);
  ctx.lineTo(210, 34);
  ctx.moveTo(226, 34);
  ctx.lineTo(258, 34);
  ctx.moveTo(274, 34);
  ctx.lineTo(322, 34);
  ctx.moveTo(18, 50);
  ctx.lineTo(34, 50);
  ctx.moveTo(114, 50);
  ctx.lineTo(130, 50);
  ctx.moveTo(146, 50);
  ctx.lineTo(178, 50);
  ctx.moveTo(210, 50);
  ctx.lineTo(226, 50);
  ctx.moveTo(242, 50);
  ctx.lineTo(258, 50);
  ctx.moveTo(274, 50);
  ctx.lineTo(306, 50);
  ctx.moveTo(322, 50);
  ctx.lineTo(338, 50);
  ctx.moveTo(354, 50);
  ctx.lineTo(370, 50);
  ctx.moveTo(2, 66);
  ctx.lineTo(50, 66);
  ctx.moveTo(66, 66);
  ctx.lineTo(82, 66);
  ctx.moveTo(130, 66);
  ctx.lineTo(242, 66);
  ctx.moveTo(258, 66);
  ctx.lineTo(354, 66);
  ctx.moveTo(370, 66);
  ctx.lineTo(402, 66);
  ctx.moveTo(66, 82);
  ctx.lineTo(98, 82);
  ctx.moveTo(114, 82);
  ctx.lineTo(130, 82);
  ctx.moveTo(178, 82);
  ctx.lineTo(226, 82);
  ctx.moveTo(274, 82);
  ctx.lineTo(338, 82);
  ctx.moveTo(354, 82);
  ctx.lineTo(370, 82);
  ctx.moveTo(2, 98);
  ctx.lineTo(18, 98);
  ctx.moveTo(34, 98);
  ctx.lineTo(114, 98);
  ctx.moveTo(146, 98);
  ctx.lineTo(194, 98);
  ctx.moveTo(210, 98);
  ctx.lineTo(242, 98);
  ctx.moveTo(258, 98);
  ctx.lineTo(274, 98);
  ctx.moveTo(370, 98);
  ctx.lineTo(402, 98);
  ctx.moveTo(50, 114);
  ctx.lineTo(82, 114);
  ctx.moveTo(98, 114);
  ctx.lineTo(114, 114);
  ctx.moveTo(146, 114);
  ctx.lineTo(178, 114);
  ctx.moveTo(194, 114);
  ctx.lineTo(258, 114);
  ctx.moveTo(322, 114);
  ctx.lineTo(338, 114);
  ctx.moveTo(354, 114);
  ctx.lineTo(370, 114);
  ctx.moveTo(2, 130);
  ctx.lineTo(98, 130);
  ctx.moveTo(114, 130);
  ctx.lineTo(146, 130);
  ctx.moveTo(162, 130);
  ctx.lineTo(194, 130);
  ctx.moveTo(226, 130);
  ctx.lineTo(258, 130);
  ctx.moveTo(290, 130);
  ctx.lineTo(322, 130);
  ctx.moveTo(338, 130);
  ctx.lineTo(386, 130);
  ctx.moveTo(18, 146);
  ctx.lineTo(82, 146);
  ctx.moveTo(146, 146);
  ctx.lineTo(162, 146);
  ctx.moveTo(194, 146);
  ctx.lineTo(210, 146);
  ctx.moveTo(258, 146);
  ctx.lineTo(274, 146);
  ctx.moveTo(290, 146);
  ctx.lineTo(306, 146);
  ctx.moveTo(354, 146);
  ctx.lineTo(370, 146);
  ctx.moveTo(386, 146);
  ctx.lineTo(402, 146);
  ctx.moveTo(34, 162);
  ctx.lineTo(66, 162);
  ctx.moveTo(82, 162);
  ctx.lineTo(98, 162);
  ctx.moveTo(130, 162);
  ctx.lineTo(146, 162);
  ctx.moveTo(162, 162);
  ctx.lineTo(194, 162);
  ctx.moveTo(210, 162);
  ctx.lineTo(242, 162);
  ctx.moveTo(258, 162);
  ctx.lineTo(290, 162);
  ctx.moveTo(322, 162);
  ctx.lineTo(354, 162);
  ctx.moveTo(370, 162);
  ctx.lineTo(402, 162);
  ctx.moveTo(18, 178);
  ctx.lineTo(50, 178);
  ctx.moveTo(66, 178);
  ctx.lineTo(114, 178);
  ctx.moveTo(210, 178);
  ctx.lineTo(226, 178);
  ctx.moveTo(242, 178);
  ctx.lineTo(258, 178);
  ctx.moveTo(370, 178);
  ctx.lineTo(386, 178);
  ctx.moveTo(2, 194);
  ctx.lineTo(18, 194);
  ctx.moveTo(66, 194);
  ctx.lineTo(98, 194);
  ctx.moveTo(130, 194);
  ctx.lineTo(162, 194);
  ctx.moveTo(178, 194);
  ctx.lineTo(210, 194);
  ctx.moveTo(226, 194);
  ctx.lineTo(242, 194);
  ctx.moveTo(258, 194);
  ctx.lineTo(274, 194);
  ctx.moveTo(306, 194);
  ctx.lineTo(322, 194);
  ctx.moveTo(338, 194);
  ctx.lineTo(354, 194);
  ctx.moveTo(18, 210);
  ctx.lineTo(34, 210);
  ctx.moveTo(50, 210);
  ctx.lineTo(82, 210);
  ctx.moveTo(98, 210);
  ctx.lineTo(130, 210);
  ctx.moveTo(210, 210);
  ctx.lineTo(226, 210);
  ctx.moveTo(242, 210);
  ctx.lineTo(258, 210);
  ctx.moveTo(322, 210);
  ctx.lineTo(338, 210);
  ctx.moveTo(354, 210);
  ctx.lineTo(370, 210);
  ctx.moveTo(386, 210);
  ctx.lineTo(402, 210);
  ctx.moveTo(18, 226);
  ctx.lineTo(66, 226);
  ctx.moveTo(82, 226);
  ctx.lineTo(98, 226);
  ctx.moveTo(146, 226);
  ctx.lineTo(162, 226);
  ctx.moveTo(194, 226);
  ctx.lineTo(210, 226);
  ctx.moveTo(226, 226);
  ctx.lineTo(274, 226);
  ctx.moveTo(290, 226);
  ctx.lineTo(322, 226);
  ctx.moveTo(338, 226);
  ctx.lineTo(386, 226);
  ctx.moveTo(34, 242);
  ctx.lineTo(50, 242);
  ctx.moveTo(114, 242);
  ctx.lineTo(146, 242);
  ctx.moveTo(162, 242);
  ctx.lineTo(210, 242);
  ctx.moveTo(242, 242);
  ctx.lineTo(290, 242);
  ctx.moveTo(306, 242);
  ctx.lineTo(354, 242);
  ctx.moveTo(370, 242);
  ctx.lineTo(402, 242);
  ctx.moveTo(18, 258);
  ctx.lineTo(34, 258);
  ctx.moveTo(66, 258);
  ctx.lineTo(82, 258);
  ctx.moveTo(98, 258);
  ctx.lineTo(114, 258);
  ctx.moveTo(130, 258);
  ctx.lineTo(194, 258);
  ctx.moveTo(210, 258);
  ctx.lineTo(226, 258);
  ctx.moveTo(338, 258);
  ctx.lineTo(386, 258);
  ctx.moveTo(2, 274);
  ctx.lineTo(18, 274);
  ctx.moveTo(82, 274);
  ctx.lineTo(98, 274);
  ctx.moveTo(114, 274);
  ctx.lineTo(210, 274);
  ctx.moveTo(226, 274);
  ctx.lineTo(274, 274);
  ctx.moveTo(322, 274);
  ctx.lineTo(354, 274);
  ctx.moveTo(386, 274);
  ctx.lineTo(402, 274);
  ctx.moveTo(66, 290);
  ctx.lineTo(114, 290);
  ctx.moveTo(146, 290);
  ctx.lineTo(162, 290);
  ctx.moveTo(178, 290);
  ctx.lineTo(194, 290);
  ctx.moveTo(210, 290);
  ctx.lineTo(226, 290);
  ctx.moveTo(242, 290);
  ctx.lineTo(258, 290);
  ctx.moveTo(306, 290);
  ctx.lineTo(322, 290);
  ctx.moveTo(338, 290);
  ctx.lineTo(386, 290);
  ctx.moveTo(18, 306);
  ctx.lineTo(98, 306);
  ctx.moveTo(114, 306);
  ctx.lineTo(146, 306);
  ctx.moveTo(162, 306);
  ctx.lineTo(178, 306);
  ctx.moveTo(210, 306);
  ctx.lineTo(226, 306);
  ctx.moveTo(258, 306);
  ctx.lineTo(306, 306);
  ctx.moveTo(322, 306);
  ctx.lineTo(354, 306);
  ctx.moveTo(386, 306);
  ctx.lineTo(402, 306);
  ctx.moveTo(2, 322);
  ctx.lineTo(66, 322);
  ctx.moveTo(98, 322);
  ctx.lineTo(114, 322);
  ctx.moveTo(146, 322);
  ctx.lineTo(210, 322);
  ctx.moveTo(226, 322);
  ctx.lineTo(258, 322);
  ctx.moveTo(290, 322);
  ctx.lineTo(306, 322);
  ctx.moveTo(354, 322);
  ctx.lineTo(386, 322);
  ctx.moveTo(98, 338);
  ctx.lineTo(114, 338);
  ctx.moveTo(210, 338);
  ctx.lineTo(226, 338);
  ctx.moveTo(274, 338);
  ctx.lineTo(290, 338);
  ctx.moveTo(306, 338);
  ctx.lineTo(322, 338);
  ctx.moveTo(338, 338);
  ctx.lineTo(402, 338);
  ctx.moveTo(34, 354);
  ctx.lineTo(50, 354);
  ctx.moveTo(114, 354);
  ctx.lineTo(162, 354);
  ctx.moveTo(178, 354);
  ctx.lineTo(210, 354);
  ctx.moveTo(226, 354);
  ctx.lineTo(242, 354);
  ctx.moveTo(258, 354);
  ctx.lineTo(306, 354);
  ctx.moveTo(322, 354);
  ctx.lineTo(338, 354);
  ctx.moveTo(18, 370);
  ctx.lineTo(34, 370);
  ctx.moveTo(98, 370);
  ctx.lineTo(130, 370);
  ctx.moveTo(146, 370);
  ctx.lineTo(178, 370);
  ctx.moveTo(210, 370);
  ctx.lineTo(258, 370);
  ctx.moveTo(274, 370);
  ctx.lineTo(290, 370);
  ctx.moveTo(306, 370);
  ctx.lineTo(354, 370);
  ctx.moveTo(370, 370);
  ctx.lineTo(386, 370);
  ctx.moveTo(82, 386);
  ctx.lineTo(194, 386);
  ctx.moveTo(226, 386);
  ctx.lineTo(258, 386);
  ctx.moveTo(306, 386);
  ctx.lineTo(322, 386);
  ctx.moveTo(354, 386);
  ctx.lineTo(370, 386);
  ctx.moveTo(2, 402);
  ctx.lineTo(194, 402);
  ctx.moveTo(210, 402);
  ctx.lineTo(402, 402);
  ctx.moveTo(2, 2);
  ctx.lineTo(2, 402);
  ctx.moveTo(18, 18);
  ctx.lineTo(18, 50);
  ctx.moveTo(18, 66);
  ctx.lineTo(18, 82);
  ctx.moveTo(18, 98);
  ctx.lineTo(18, 114);
  ctx.moveTo(18, 146);
  ctx.lineTo(18, 178);
  ctx.moveTo(18, 210);
  ctx.lineTo(18, 258);
  ctx.moveTo(18, 290);
  ctx.lineTo(18, 306);
  ctx.moveTo(18, 338);
  ctx.lineTo(18, 386);
  ctx.moveTo(34, 34);
  ctx.lineTo(34, 50);
  ctx.moveTo(34, 82);
  ctx.lineTo(34, 114);
  ctx.moveTo(34, 178);
  ctx.lineTo(34, 210);
  ctx.moveTo(34, 258);
  ctx.lineTo(34, 290);
  ctx.moveTo(34, 322);
  ctx.lineTo(34, 354);
  ctx.moveTo(34, 370);
  ctx.lineTo(34, 402);
  ctx.moveTo(50, 50);
  ctx.lineTo(50, 82);
  ctx.moveTo(50, 114);
  ctx.lineTo(50, 130);
  ctx.moveTo(50, 178);
  ctx.lineTo(50, 210);
  ctx.moveTo(50, 242);
  ctx.lineTo(50, 306);
  ctx.moveTo(50, 322);
  ctx.lineTo(50, 338);
  ctx.moveTo(50, 354);
  ctx.lineTo(50, 386);
  ctx.moveTo(66, 18);
  ctx.lineTo(66, 66);
  ctx.moveTo(66, 162);
  ctx.lineTo(66, 194);
  ctx.moveTo(66, 226);
  ctx.lineTo(66, 290);
  ctx.moveTo(66, 338);
  ctx.lineTo(66, 402);
  ctx.moveTo(82, 2);
  ctx.lineTo(82, 66);
  ctx.moveTo(82, 210);
  ctx.lineTo(82, 242);
  ctx.moveTo(82, 306);
  ctx.lineTo(82, 354);
  ctx.moveTo(82, 370);
  ctx.lineTo(82, 386);
  ctx.moveTo(98, 34);
  ctx.lineTo(98, 162);
  ctx.moveTo(98, 194);
  ctx.lineTo(98, 210);
  ctx.moveTo(98, 226);
  ctx.lineTo(98, 274);
  ctx.moveTo(98, 306);
  ctx.lineTo(98, 322);
  ctx.moveTo(98, 338);
  ctx.lineTo(98, 370);
  ctx.moveTo(114, 50);
  ctx.lineTo(114, 82);
  ctx.moveTo(114, 130);
  ctx.lineTo(114, 178);
  ctx.moveTo(114, 194);
  ctx.lineTo(114, 242);
  ctx.moveTo(114, 258);
  ctx.lineTo(114, 274);
  ctx.moveTo(114, 290);
  ctx.lineTo(114, 306);
  ctx.moveTo(114, 322);
  ctx.lineTo(114, 338);
  ctx.moveTo(130, 2);
  ctx.lineTo(130, 18);
  ctx.moveTo(130, 50);
  ctx.lineTo(130, 66);
  ctx.moveTo(130, 82);
  ctx.lineTo(130, 114);
  ctx.moveTo(130, 146);
  ctx.lineTo(130, 194);
  ctx.moveTo(130, 210);
  ctx.lineTo(130, 226);
  ctx.moveTo(130, 242);
  ctx.lineTo(130, 258);
  ctx.moveTo(130, 274);
  ctx.lineTo(130, 290);
  ctx.moveTo(130, 306);
  ctx.lineTo(130, 354);
  ctx.moveTo(130, 370);
  ctx.lineTo(130, 386);
  ctx.moveTo(146, 18);
  ctx.lineTo(146, 50);
  ctx.moveTo(146, 82);
  ctx.lineTo(146, 98);
  ctx.moveTo(146, 114);
  ctx.lineTo(146, 146);
  ctx.moveTo(146, 162);
  ctx.lineTo(146, 178);
  ctx.moveTo(146, 194);
  ctx.lineTo(146, 210);
  ctx.moveTo(146, 226);
  ctx.lineTo(146, 242);
  ctx.moveTo(146, 290);
  ctx.lineTo(146, 306);
  ctx.moveTo(146, 322);
  ctx.lineTo(146, 338);
  ctx.moveTo(146, 354);
  ctx.lineTo(146, 370);
  ctx.moveTo(162, 66);
  ctx.lineTo(162, 82);
  ctx.moveTo(162, 146);
  ctx.lineTo(162, 194);
  ctx.moveTo(162, 210);
  ctx.lineTo(162, 226);
  ctx.moveTo(162, 290);
  ctx.lineTo(162, 322);
  ctx.moveTo(162, 338);
  ctx.lineTo(162, 354);
  ctx.moveTo(178, 18);
  ctx.lineTo(178, 50);
  ctx.moveTo(178, 82);
  ctx.lineTo(178, 98);
  ctx.moveTo(178, 130);
  ctx.lineTo(178, 146);
  ctx.moveTo(178, 178);
  ctx.lineTo(178, 242);
  ctx.moveTo(178, 322);
  ctx.lineTo(178, 338);
  ctx.moveTo(178, 354);
  ctx.lineTo(178, 370);
  ctx.moveTo(194, 2);
  ctx.lineTo(194, 66);
  ctx.moveTo(194, 98);
  ctx.lineTo(194, 130);
  ctx.moveTo(194, 146);
  ctx.lineTo(194, 178);
  ctx.moveTo(194, 210);
  ctx.lineTo(194, 226);
  ctx.moveTo(194, 242);
  ctx.lineTo(194, 258);
  ctx.moveTo(194, 274);
  ctx.lineTo(194, 306);
  ctx.moveTo(194, 338);
  ctx.lineTo(194, 354);
  ctx.moveTo(194, 370);
  ctx.lineTo(194, 402);
  ctx.moveTo(210, 2);
  ctx.lineTo(210, 18);
  ctx.moveTo(210, 130);
  ctx.lineTo(210, 146);
  ctx.moveTo(210, 162);
  ctx.lineTo(210, 210);
  ctx.moveTo(210, 226);
  ctx.lineTo(210, 242);
  ctx.moveTo(210, 258);
  ctx.lineTo(210, 274);
  ctx.moveTo(210, 290);
  ctx.lineTo(210, 338);
  ctx.moveTo(210, 354);
  ctx.lineTo(210, 402);
  ctx.moveTo(226, 18);
  ctx.lineTo(226, 66);
  ctx.moveTo(226, 114);
  ctx.lineTo(226, 162);
  ctx.moveTo(226, 210);
  ctx.lineTo(226, 274);
  ctx.moveTo(226, 338);
  ctx.lineTo(226, 354);
  ctx.moveTo(242, 66);
  ctx.lineTo(242, 98);
  ctx.moveTo(242, 146);
  ctx.lineTo(242, 162);
  ctx.moveTo(242, 178);
  ctx.lineTo(242, 210);
  ctx.moveTo(242, 242);
  ctx.lineTo(242, 258);
  ctx.moveTo(242, 274);
  ctx.lineTo(242, 338);
  ctx.moveTo(258, 18);
  ctx.lineTo(258, 34);
  ctx.moveTo(258, 50);
  ctx.lineTo(258, 82);
  ctx.moveTo(258, 98);
  ctx.lineTo(258, 114);
  ctx.moveTo(258, 130);
  ctx.lineTo(258, 146);
  ctx.moveTo(258, 162);
  ctx.lineTo(258, 178);
  ctx.moveTo(258, 258);
  ctx.lineTo(258, 274);
  ctx.moveTo(258, 322);
  ctx.lineTo(258, 354);
  ctx.moveTo(258, 386);
  ctx.lineTo(258, 402);
  ctx.moveTo(274, 2);
  ctx.lineTo(274, 34);
  ctx.moveTo(274, 82);
  ctx.lineTo(274, 98);
  ctx.moveTo(274, 114);
  ctx.lineTo(274, 146);
  ctx.moveTo(274, 178);
  ctx.lineTo(274, 226);
  ctx.moveTo(274, 242);
  ctx.lineTo(274, 258);
  ctx.moveTo(274, 290);
  ctx.lineTo(274, 306);
  ctx.moveTo(274, 322);
  ctx.lineTo(274, 338);
  ctx.moveTo(274, 370);
  ctx.lineTo(274, 386);
  ctx.moveTo(290, 82);
  ctx.lineTo(290, 130);
  ctx.moveTo(290, 146);
  ctx.lineTo(290, 210);
  ctx.moveTo(290, 226);
  ctx.lineTo(290, 322);
  ctx.moveTo(290, 338);
  ctx.lineTo(290, 354);
  ctx.moveTo(290, 370);
  ctx.lineTo(290, 402);
  ctx.moveTo(306, 34);
  ctx.lineTo(306, 50);
  ctx.moveTo(306, 98);
  ctx.lineTo(306, 130);
  ctx.moveTo(306, 146);
  ctx.lineTo(306, 194);
  ctx.moveTo(306, 210);
  ctx.lineTo(306, 226);
  ctx.moveTo(306, 258);
  ctx.lineTo(306, 290);
  ctx.moveTo(306, 322);
  ctx.lineTo(306, 338);
  ctx.moveTo(306, 354);
  ctx.lineTo(306, 370);
  ctx.moveTo(322, 82);
  ctx.lineTo(322, 98);
  ctx.moveTo(322, 130);
  ctx.lineTo(322, 146);
  ctx.moveTo(322, 162);
  ctx.lineTo(322, 178);
  ctx.moveTo(322, 194);
  ctx.lineTo(322, 226);
  ctx.moveTo(322, 242);
  ctx.lineTo(322, 274);
  ctx.moveTo(322, 290);
  ctx.lineTo(322, 322);
  ctx.moveTo(322, 386);
  ctx.lineTo(322, 402);
  ctx.moveTo(338, 2);
  ctx.lineTo(338, 66);
  ctx.moveTo(338, 82);
  ctx.lineTo(338, 162);
  ctx.moveTo(338, 178);
  ctx.lineTo(338, 210);
  ctx.moveTo(338, 226);
  ctx.lineTo(338, 242);
  ctx.moveTo(338, 274);
  ctx.lineTo(338, 290);
  ctx.moveTo(338, 306);
  ctx.lineTo(338, 354);
  ctx.moveTo(338, 370);
  ctx.lineTo(338, 386);
  ctx.moveTo(354, 18);
  ctx.lineTo(354, 50);
  ctx.moveTo(354, 82);
  ctx.lineTo(354, 114);
  ctx.moveTo(354, 162);
  ctx.lineTo(354, 194);
  ctx.moveTo(354, 210);
  ctx.lineTo(354, 226);
  ctx.moveTo(354, 354);
  ctx.lineTo(354, 370);
  ctx.moveTo(354, 386);
  ctx.lineTo(354, 402);
  ctx.moveTo(370, 18);
  ctx.lineTo(370, 82);
  ctx.moveTo(370, 130);
  ctx.lineTo(370, 146);
  ctx.moveTo(370, 162);
  ctx.lineTo(370, 210);
  ctx.moveTo(370, 258);
  ctx.lineTo(370, 322);
  ctx.moveTo(370, 338);
  ctx.lineTo(370, 354);
  ctx.moveTo(370, 370);
  ctx.lineTo(370, 386);
  ctx.moveTo(386, 2);
  ctx.lineTo(386, 50);
  ctx.moveTo(386, 82);
  ctx.lineTo(386, 98);
  ctx.moveTo(386, 114);
  ctx.lineTo(386, 130);
  ctx.moveTo(386, 194);
  ctx.lineTo(386, 210);
  ctx.moveTo(386, 354);
  ctx.lineTo(386, 386);
  ctx.moveTo(402, 2);
  ctx.lineTo(402, 402);
  ctx.stroke();
  ctx.restore();
}

function buildHitMap() {
  hitCanvas.width = MAZE_SIZE;
  hitCanvas.height = MAZE_SIZE;
  hitCtx.clearRect(0, 0, MAZE_SIZE, MAZE_SIZE);
  // Labirint narišemo še na platno, da lahko preverjamo trke z zidovi.
  drawWalls(hitCtx, 1, 0, 0);
}

// risanje igralca
function drawPlayer() {
  ctx.font = `${Math.max(14, viewSize * 0.032)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText("🐵", screenX(player.x), screenY(player.y));
}

function drawBananas() {
  ctx.font = `${Math.max(14, viewSize * 0.032)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";

  for (const banana of bananas) {
    if (!banana.got) {
      ctx.fillText("🍌", screenX(banana.x), screenY(banana.y));
    }
  }
}

// 
function drawGoal() {
  ctx.fillStyle = "rgba(239, 68, 68, 0.25)";
  ctx.beginPath();
  ctx.font = `${Math.max(16, viewSize * 0.04)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText("🎯", screenX(GOAL.x), screenY(GOAL.y));
}

function drawScene() {
  ctx.clearRect(0, 0, cw, ch);

  const bg = ctx.createLinearGradient(0, 0, cw, ch);
  bg.addColorStop(0, "rgba(9, 18, 13, 0.92)");
  bg.addColorStop(1, "rgba(35, 67, 46, 0.88)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);

  ctx.fillStyle = "rgba(98, 149, 114, 0.16)";
  ctx.fillRect(offsetX, offsetY, viewSize, viewSize);

  drawWalls(ctx, scale, offsetX, offsetY);
  drawBananas();
  drawGoal();
  drawPlayer();
}

// Preveri, ali se igralec lahko postavi na dano točko brez dotika z zidom.
function canMoveTo(x, y) {
  const points = [
    [0, 0],
    [PLAYER_RADIUS, 0],
    [-PLAYER_RADIUS, 0],
    [0, PLAYER_RADIUS],
    [0, -PLAYER_RADIUS],
    [PLAYER_RADIUS * 0.7, PLAYER_RADIUS * 0.7],
    [PLAYER_RADIUS * 0.7, -PLAYER_RADIUS * 0.7],
    [-PLAYER_RADIUS * 0.7, PLAYER_RADIUS * 0.7],
    [-PLAYER_RADIUS * 0.7, -PLAYER_RADIUS * 0.7],
  ];

  for (const [dx, dy] of points) {
    const sx = Math.round(x + dx);
    const sy = Math.round(y + dy);
    if (sx < 0 || sy < 0 || sx >= MAZE_SIZE || sy >= MAZE_SIZE) return false;

    const pixel = hitCtx.getImageData(sx, sy, 1, 1).data;
    const brightness = pixel[0] + pixel[1] + pixel[2];
    if (pixel[3] > 0 && brightness < 120) return false;
  }

  return true;
}

function updateHud() {
  hudBananas.textContent = `🍌 ${bananasGot}/${bananas.length}`;
}

// Poišče naključno prosto točko v labirintu, ki ni preblizu starta, cilja ali drugih banan.
function randomFreePoint() {
  for (let i = 0; i < 2000; i++) {
    const x = 20 + Math.random() * (MAZE_SIZE - 40);
    const y = 20 + Math.random() * (MAZE_SIZE - 40);
    if (!canMoveTo(x, y)) continue;
    if (Math.hypot(x - START.x, y - START.y) < 24) continue;
    if (Math.hypot(x - GOAL.x, y - GOAL.y) < 24) continue;
    if (bananas.some((banana) => Math.hypot(x - banana.x, y - banana.y) < 24)) continue;
    return { x, y, got: false };
  }

  return { x: START.x, y: START.y + 24, got: false };
}

// Ustvari banano, ki se bo premikala po osi y ne glede na zidove.
function randomMovingBananaPoint() {
  const margin = 10;

  for (let i = 0; i < 2000; i++) {
    const banana = randomFreePoint();

    banana.moving = true;
    banana.minY = margin;
    banana.maxY = MAZE_SIZE - margin;
    banana.direction = Math.random() < 0.5 ? -1 : 1;
    banana.speed = MOVING_BANANA_SPEED;
    return banana;
  }

  return {
    ...randomFreePoint(),
    moving: false,
  };
}

// Ob novi igri ustvarimo 2 premikajoči banani in ostale navadne.
function spawnBananas() {
  bananas = [];
  for (let i = 0; i < MOVING_BANANA_COUNT; i++) {
    bananas.push(randomMovingBananaPoint());
  }

  for (let i = MOVING_BANANA_COUNT; i < BANANA_COUNT; i++) {
    bananas.push(randomFreePoint());
  }

  bananasGot = 0;
}

// V vsakem frame-u premaknemo banane
function updateBananas(dt) {
  for (const banana of bananas) {
    if (banana.got || !banana.moving) continue;

    const nextY = banana.y + banana.direction * banana.speed * dt;

    if (nextY <= banana.minY) {
      banana.y = banana.minY;
      banana.direction = 1;
      continue;
    }

    if (nextY >= banana.maxY) {
      banana.y = banana.maxY;
      banana.direction = -1;
      continue;
    }

    banana.y = nextY;
  }
}

// Če je igralec dovolj blizu banane, jo označimo kot pobrano.
function collectBananas() {
  for (const banana of bananas) {
    if (banana.got) continue;
    if (Math.hypot(player.x - banana.x, player.y - banana.y) < 14) {
      banana.got = true;
      bananasGot++;
    }
  }
}

function resetPlayer() {
  player = { ...START };
  updateHud();
  drawScene();
}

// Popoln reset igre: nove banane in igralec nazaj na začetek.
function resetGame() {
  spawnBananas();
  resetPlayer();
}

// Ob prihodu do cilja preverimo, ali so vse banane res pobrane.
function checkWin() {
  if (Math.hypot(player.x - GOAL.x, player.y - GOAL.y) < 16) {
    hudBananas.textContent = bananasGot === bananas.length ? "Vse banane pobrane" : "Poberi vse banane";
  }
}

// Iz smeri tipk izračunamo premik igralca in ga dovolimo samo skozi proste poti.
function movePlayer(dt) {
  let dx = 0;
  let dy = 0;

  if (keys.ArrowUp) dy -= 1;
  if (keys.ArrowDown) dy += 1;
  if (keys.ArrowLeft) dx -= 1;
  if (keys.ArrowRight) dx += 1;
  if (!dx && !dy) return;

  const length = Math.hypot(dx, dy);
  const stepX = (dx / length) * PLAYER_SPEED * dt;
  const stepY = (dy / length) * PLAYER_SPEED * dt;

  const nextX = player.x + stepX;
  const nextY = player.y + stepY;

  if (canMoveTo(nextX, player.y)) {
    player.x = nextX;
  }
  if (canMoveTo(player.x, nextY)) {
    player.y = nextY;
  }

  collectBananas();
  updateHud();
  checkWin();
}

// Glavna animacijska zanka: posodobi banane, igralca in nato še izriše sceno.
function frame(time) {
  if (!lastTime) lastTime = time;
  const dt = Math.min(0.03, (time - lastTime) / 1000);
  lastTime = time;

  updateBananas(dt);
  movePlayer(dt);
  drawScene();
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (event) => {
  if (!(event.key in keys)) return;
  event.preventDefault();
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  if (!(event.key in keys)) return;
  keys[event.key] = false;
});

window.addEventListener("resize", () => {
  resizeCanvas();
  drawScene();
});

btnNew.addEventListener("click", resetGame);
btnReset.addEventListener("click", resetPlayer);

vizitka.addEventListener("click", () => {
      Swal.fire({
        title: 'Avtor',
        text: 'Tilen Čečko',
        icon: 'info',
        confirmButtonText: 'V redu'
    });
});

gameEl.addEventListener("click", () => gameEl.focus());

// Začetna nastavitev igre ob nalaganju strani.
function boot() {
  resizeCanvas();
  buildHitMap();
  resetGame();
  gameEl.focus();
  requestAnimationFrame(frame);
}

boot();
