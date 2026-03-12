const COLS = 25;
const ROWS = 25;
const BANANA_COUNT = 6;

const gameEl = document.getElementById("game");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const hudBananas = document.getElementById("banane");
const hudMoves = document.getElementById("koraki");

const btnNew = document.getElementById("nov");
const btnReset = document.getElementById("reset");
const vizitka = document.getElementById("vizitka");

const start = { x: 12, y: 0 };
const end = { x: 12, y: ROWS - 1 };

let player = { ...start };
let playerRender = { ...start };
let playerTarget = { ...start };
let moving = false;
const MOVE_MS = 140;
let bananas = [];
let bananasGot = 0;
let moves = 0;

let cw = 720;
let ch = 720;

function inBounds(x, y) {
  return x >= 0 && y >= 0 && x < COLS && y < ROWS;
}

function key(x, y) {
  return `${x},${y}`;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateHUD() {
  hudBananas.textContent = `🍌 ${bananasGot}/${bananas.length}`;
  hudMoves.textContent = `Koraki: ${moves}`;
}

function resetPlayerState() {
  player = { ...start };
  playerRender = { ...start };
  playerTarget = { ...start };
  moving = false;
  moves = 0;
}

function newGame() {
  resetPlayerState();
  spawnBananas(BANANA_COUNT);
  bananasGot = 0;
  updateHUD();
}

function spawnBananas(count) {
  bananas = [];
  const taken = new Set([key(start.x, start.y), key(end.x, end.y)]);

  const cells = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cellKey = key(x, y);
      if (!taken.has(cellKey)) {
        cells.push({ x, y });
      }
    }
  }

  shuffle(cells);
  bananas = cells.slice(0, count).map(({ x, y }) => ({ x, y, got: false }));
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

function drawWalls(cell, offsetX, offsetY) {
  const scale = cell / 16;

  ctx.save();
  ctx.translate(offsetX - 2 * scale, offsetY - 2 * scale);
  ctx.scale(scale, scale);
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

function draw() {
  const size = Math.min(cw, ch);
  const cell = size / COLS;
  const mazeWidth = COLS * cell;
  const mazeHeight = ROWS * cell;
  const offsetX = (cw - mazeWidth) / 2;
  const offsetY = (ch - mazeHeight) / 2;

  ctx.clearRect(0, 0, cw, ch);

  const bg = ctx.createLinearGradient(0, 0, cw, ch);
  bg.addColorStop(0, "rgba(9, 18, 13, 0.92)");
  bg.addColorStop(1, "rgba(35, 67, 46, 0.88)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);

  ctx.fillStyle = "rgba(98, 149, 114, 0.16)";
  ctx.fillRect(offsetX, offsetY, mazeWidth, mazeHeight);

  ctx.fillStyle = "rgba(239, 68, 68, 0.32)";
  ctx.fillRect(offsetX + end.x * cell, offsetY + end.y * cell, cell, cell);

  // najprej narišemo zidove
  drawWalls(cell, offsetX, offsetY);

  // banane
  for (const b of bananas) {
    if (!b.got) {
      drawEmoji("🍌", b.x, b.y, cell, offsetX, offsetY);
    }
  }

  // igralec in cilj
  drawEmoji("🐵", playerRender.x, playerRender.y, cell, offsetX, offsetY);
  drawEmoji("🎯", end.x, end.y, cell, offsetX, offsetY);
}

function drawEmoji(emoji, x, y, cell, offsetX, offsetY) {
  const cxp = offsetX + x * cell + cell / 2;
  const cyp = offsetY + y * cell + cell / 2;
  ctx.font = `${Math.floor(cell * 0.7)}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(emoji, cxp, cyp);
}

function showMessage(title, text, icon) {
  if (typeof Swal !== "undefined") {
    Swal.fire({ title, text, icon, confirmButtonText: "V redu" });
    return;
  }
  window.alert(`${title}\n\n${text}`);
}

function checkWin() {
  if (player.x === end.x && player.y === end.y) {
    if (bananasGot === bananas.length) {
      showMessage("Zmaga 🎉", "Pobral si vse banane.", "success");
    } else {
      showMessage("Napaka", "Naprej poberi vse banane.", "error");
    }
  }
}

function easeOut(t) {
  return 1 - (1 - t) * (1 - t);
}

function hasWallBetween(x, y, dx, dy) {
  const size = Math.min(cw, ch);
  const cell = size / COLS;
  const mazeWidth = COLS * cell;
  const mazeHeight = ROWS * cell;
  const offsetX = (cw - mazeWidth) / 2;
  const offsetY = (ch - mazeHeight) / 2;

  // vzamemo točko na robu med celicama
  let sx, sy;

  if (dx === 1 && dy === 0) {
    // desno
    sx = offsetX + (x + 1) * cell;
    sy = offsetY + y * cell + cell / 2;
  } else if (dx === -1 && dy === 0) {
    // levo
    sx = offsetX + x * cell;
    sy = offsetY + y * cell + cell / 2;
  } else if (dx === 0 && dy === 1) {
    // dol
    sx = offsetX + x * cell + cell / 2;
    sy = offsetY + (y + 1) * cell;
  } else if (dx === 0 && dy === -1) {
    // gor
    sx = offsetX + x * cell + cell / 2;
    sy = offsetY + y * cell;
  } else {
    return true;
  }

  // preberemo piksel
  const pixel = ctx.getImageData(Math.round(sx), Math.round(sy), 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  const a = pixel[3];

  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  if (a > 0 && brightness < 40) {
    return true; // tu je zid
  }

  return false;
}

function tryMove(dx, dy) {
  if (moving) return;

  const nx = player.x + dx;
  const ny = player.y + dy;
  if (!inBounds(nx, ny)) return;

  // zdaj gledamo canvas
  if (hasWallBetween(player.x, player.y, dx, dy)) return;

  moving = true;
  playerTarget = { x: nx, y: ny };

  const fromX = player.x;
  const fromY = player.y;
  const t0 = performance.now();

  function anim(t) {
    const p = Math.min(1, (t - t0) / MOVE_MS);
    const e = easeOut(p);

    playerRender.x = fromX + (playerTarget.x - fromX) * e;
    playerRender.y = fromY + (playerTarget.y - fromY) * e;

    draw();

    if (p < 1) {
      requestAnimationFrame(anim);
      return;
    }

    player = { ...playerTarget };
    playerRender = { ...playerTarget };
    moves++;
    updateHUD();
    collectIfBanana();
    checkWin();
    moving = false;
    draw();
  }

  requestAnimationFrame(anim);
}

function onKey(e) {
  e.stopPropagation();
  const keys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  if (!keys.includes(e.key)) return;
  e.preventDefault();

  if (e.key === "ArrowUp") tryMove(0, -1);
  if (e.key === "ArrowDown") tryMove(0, 1);
  if (e.key === "ArrowLeft") tryMove(-1, 0);
  if (e.key === "ArrowRight") tryMove(1, 0);
}

btnNew.addEventListener("click", () => {
  newGame();
  draw();
  gameEl.focus();
});

vizitka.addEventListener("click", () => {
  showMessage("Avtor", "Tilen Čečko", "info");
});

btnReset.addEventListener("click", () => {
  resetPlayerState();
  bananasGot = 0;
  bananas.forEach((b) => {
    b.got = false;
  });
  updateHUD();
  draw();
  gameEl.focus();
});

window.addEventListener("keydown", onKey);
gameEl.addEventListener("click", () => gameEl.focus());

function fitCanvasToDisplay() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  cw = rect.width;
  ch = rect.height;

  canvas.width = Math.round(cw * dpr);
  canvas.height = Math.round(ch * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function boot() {
  fitCanvasToDisplay();
  newGame();
  draw();
  gameEl.focus();
}

window.addEventListener("resize", () => {
  fitCanvasToDisplay();
  draw();
});

boot();
