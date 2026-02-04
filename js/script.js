const svg = document.getElementById('maze');
const playerEl = document.getElementById('player');
const step = 3; // Hitrost premikanja

// Pridobimo vse stene v polje za preverjanje
const walls = Array.from(svg.querySelectorAll('line')).map(line => ({
    x1: parseFloat(line.getAttribute('x1')),
    y1: parseFloat(line.getAttribute('y1')),
    x2: parseFloat(line.getAttribute('x2')),
    y2: parseFloat(line.getAttribute('y2'))
}));

function checkCollision(nx, ny, r) {
    const padding = 1.2; // Toleranca za rob stene
    
    for (let wall of walls) {
        // AABB (Axis-Aligned Bounding Box) preverjanje trka
        const minX = Math.min(wall.x1, wall.x2) - padding;
        const maxX = Math.max(wall.x1, wall.x2) + padding;
        const minY = Math.min(wall.y1, wall.y2) - padding;
        const maxY = Math.max(wall.y1, wall.y2) + padding;

        if (nx + r > minX && nx - r < maxX && ny + r > minY && ny - r < maxY) {
            return true; 
        }
    }
    return false;
}

document.addEventListener("keydown", (e) => {
    let cx = parseFloat(playerEl.getAttribute('cx'));
    let cy = parseFloat(playerEl.getAttribute('cy'));
    const r = parseFloat(playerEl.getAttribute('r'));

    let dx = 0, dy = 0;

    if (e.key === "ArrowUp" || e.key === "w") dy = -step;
    if (e.key === "ArrowDown" || e.key === "s") dy = step;
    if (e.key === "ArrowLeft" || e.key === "a") dx = -step;
    if (e.key === "ArrowRight" || e.key === "d") dx = step;

    if (dx === 0 && dy === 0) return;
    e.preventDefault();

    const nx = cx + dx;
    const ny = cy + dy;

    // Preveri trk
    if (!checkCollision(nx, ny, r)) {
        playerEl.setAttribute('cx', nx);
        playerEl.setAttribute('cy', ny);
    }

    // Zmaga (ko prideš do spodnjega izhoda)
    if (ny > 475) {
        alert("Čestitke! Našel si pot ven!");
        playerEl.setAttribute('cx', 234);
        playerEl.setAttribute('cy', 10);
    }
});