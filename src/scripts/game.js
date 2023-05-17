let context = undefined;

const gridWidth = 10;
const gridHeight = 10;
const gridSize = gridWidth * gridHeight;

const squareSize = 60;
const colors = ['white', 'black'];

function initBoard() {
    const canvas = document.getElementById('board');
    context = canvas.getContext('2d');
    drawBoard();

    drawLadder(1, 99);
    drawLadder(23, 66);
    drawLadder(12, 63);
    drawLadder(51, 85);
}

function getCellPosition(index) {
    const x = index % gridWidth;
    const y = Math.floor(index / gridWidth);
    const posX = (y % 2 == 0 ? x : gridWidth - x - 1) * squareSize;
    const posY = (gridHeight - y - 1) * squareSize;

    return [posX, posY];
}

function getJump(start, end) {
    const posStart = getCellPosition(start);
    const posEnd = getCellPosition(end);

    const offsetStart = posStart.map((value) => value + 0.5 * squareSize);
    const offsetEnd = posEnd.map((value) => value + 0.5 * squareSize);
    return [offsetStart, offsetEnd];
}

function drawBoard() {
    // Draw squares
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const index = y + x;
            context.fillStyle = colors[index % colors.length];
            let xOffset = x * squareSize;
            let yOffset = y * squareSize;
            context.fillRect(xOffset, yOffset, squareSize, squareSize);
        }
    }
    // Draw numbers
    const fontSize = 11;
    context.fillStyle = 'magenta';
    context.font = `bold ${fontSize}px Arial`;
    for (let i = 0; i < gridSize; i++) {
        const [x, y] = getCellPosition(i);
        context.fillText(i + 1, x, y + fontSize);
    }

    // Start and finish squares
    context.font = 'bold 15px Arial';
    context.fillStyle = 'magenta';
    context.fillText('Start', 13, 570);
    context.fillText('Finish', 13, 30);
}

Math.toDegree = function (radians) {
    return (radians * 180) / Math.PI;
};

function drawLadder(start, end) {
    const [[x1, y1], [x2, y2]] = getJump(start, end);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angleRadian = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    const width = 30;
    const halfWidth = Math.floor(width / 2);

    context.strokeStyle = 'green';
    context.lineWidth = 4;

    context.save();
    context.translate(x1, y1);
    context.rotate(angleRadian);

    context.beginPath();
    context.moveTo(0, -halfWidth);
    context.lineTo(length, -halfWidth);
    context.moveTo(0, halfWidth);
    context.lineTo(length, halfWidth);
    context.stroke();
    context.closePath();

    const gap = 20;
    const steps = Math.floor(length / gap);

    context.beginPath();
    for (let index = 0; index < steps; index++) {
        const element = gap * index + Math.floor(gap / 2);
        context.moveTo(element, -halfWidth);
        context.lineTo(element, halfWidth);
    }
    context.stroke();
    context.closePath();

    context.restore();
}
