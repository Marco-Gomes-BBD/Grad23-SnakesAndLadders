let context = undefined;

function initBoard() {
    const canvas = document.getElementById('board');
    context = canvas.getContext('2d');
    drawBoard();
    drawLadder(100, 110, 120, 190);
    drawLadder(30, 390, 300, 100);
    drawLadder(10, 20, 10, 100);

    drawLadder(300, 490, 400, 100);
}

function drawBoard() {
    // Parameters
    const gridWidth = 10;
    const gridHeight = 10;
    const gridSize = gridWidth * gridHeight;

    const squareSize = 60;
    const colors = ['white', 'black'];

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
        const x = i % gridWidth;
        const y = Math.floor(i / gridWidth);
        const xOffset = (y % 2 == 0 ? x : gridWidth - x - 1) * squareSize;
        const yOffset = (gridHeight - y - 1) * squareSize;
        context.fillText(i + 1, xOffset, yOffset + fontSize);
    }

    // Start and finish squares
    context.font = 'bold 15px Arial';
    context.fillStyle = 'magenta';
    context.fillText('Start', 13, 570);
    context.fillText('Finish', 13, 30);
}

// @params : (x1, y1) - start x and y coordinates
//         : (x2, y2) - end x and y coordinates
function drawLadder(x1, y1, x2, y2) {
    const width = 30;
    const height = y2 - y1;

    var dx = x2 - x1;
    var dy = y2 - y1;
    var radianAngle = Math.atan2(dy, dx);

    context.strokeStyle = 'green';
    context.lineWidth = 6;
    context.save();

    radianAngle < 0 ? context.rotate(radianAngle) : null;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1, y2);
    context.moveTo(x1 + width, y1);
    context.lineTo(x1 + width, y1 + height);
    context.stroke();

    let numSteps = height / 19;

    let xOffset = 0;
    let yOffset = 0;
    let stepOffset = y1 < y2 ? y1 : y2;
    // draw steps
    for (let i = 1; i < Math.abs(numSteps) - 1; i += 1) {
        xOffset = x1;
        yOffset = stepOffset + i * 20;
        console.log(y1 - height, numSteps, height, radianAngle);

        context.moveTo(xOffset, yOffset);
        context.lineTo(xOffset + width, yOffset);
        context.stroke();
    }

    context.closePath();
    context.restore();
}
