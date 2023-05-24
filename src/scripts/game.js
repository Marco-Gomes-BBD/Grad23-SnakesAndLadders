import { PlayerCard } from './player_card.js';

const canvas = document.getElementById('board');
let context = canvas.getContext('2d');

const gridWidth = 10;
const gridHeight = 10;
const gridSize = gridWidth * gridHeight;

const squareSize = 60;
const colors = ['white', 'black'];

// get ladders
const ladders = ladderPositions(state.board.ladders);
// get snakes
const snakes = snakePositions(state.board.snakes);

function setupGame() {
    players[0].isPlayersTurn = 1;
}

function innitPlayers() {
    // draw players
    players.map((player) => {
        drawPlayer(player.currentPosition, player.icon);
    });
}

// Function to handle player movement
function movePlayer(moves) {
    players.map((player) => {
        if (player.isPlayersTurn) {
            const newPosition = player.currentPosition + moves;
            if (newPosition <= gridSize - 1) {
                player.currentPosition = newPosition;
            }
        }
        player.isPlayersTurn = !player.isPlayersTurn;
    });

    initBoard();

    players.map((player) => {
        if (player.isPlayersTurn) {
            // climb up ladder
            for (let i = 0; i < ladders.length; i++) {
                const ladder = ladders[i];
                if (ladder[1] === player.currentPosition) {
                    player.currentPosition = ladder[0];
                }
            }
            // get bitten by snake
            for (let i = 0; i < snakes.length; i++) {
                const snake = snakes[i];
                if (snake[0] === player.currentPosition) {
                    player.currentPosition = snake[1];
                }
            }
        }
    });

    setTimeout(() => {
        initBoard();
    }, 2000);
}

const numColumns = 10; // Number of columns in the board
function getCellCoordinates(cellValue) {
    const row = Math.floor((cellValue - 1) / numColumns);
    const isEvenRow = row % 2 === 0;
    const column = isEvenRow
        ? (cellValue - 1) % numColumns
        : numColumns - 1 - ((cellValue - 1) % numColumns);
    return { row, column };
}

function initBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    ladders.map((ladder) => {
        drawLadder(ladder[0], ladder[1]);
    });

    innitPlayers();

    drawLadder(1, 99);
    drawLadder(23, 66);
    drawLadder(12, 63);
    drawLadder(51, 85);

    // bacause of image restrications distance between head and tail needs to be greater that 3 blocks, both vertically and horrizontally
    // ^have to write checks for above restrictions
    // head can't be a border cell
    // TODO: fix right to light snakes
    drawSnake(59, 19);
    drawSnake(76, 12);
    drawSnake(90, 38);
    drawSnake(52, 2);
    drawSnake(86, 65);
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

function drawSnake(head, tail) {
    let newImage = new Image();
    let ImageArray = new Array();
    ImageArray[0] = '/res/snakes/snake1.png';
    ImageArray[1] = '/res/snakes/snake2.png';
    ImageArray[2] = '/res/snakes/snake3.png';

    // get random snake
    let num = Math.floor(Math.random() * 3);
    let img = ImageArray[num];

    newImage.src = img;

    let width = 65;
    const halfWidth = Math.floor(width / 2);
    const [[x1, y1], [x2, y2]] = getJump(head - 1, tail);
    const dx = x2 - x1;
    const dy = y2 - y1;
    let angleRadian = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    const [startx, starty] = getCellPosition(head - 1);
    const [endx, endy] = getCellPosition(tail);

    const xOffset = startx / 60 - endx / 60;
    newImage.onload = function () {
        context.save();
        context.translate(startx, starty);
        {
            if (Math.abs(xOffset) !== 1) {
                if (startx / 60 < endx / 60) {
                    // left to right
                    context.save();
                    context.translate(0, halfWidth);
                    context.rotate(-Math.PI / 2 + angleRadian);
                    context.transform(1, 0, -0.05, 1.1, 0, 0);
                    context.drawImage(newImage, 0, 0, width, length);
                    context.restore();
                } else {
                    // right to left
                    context.save();
                    context.translate(0, -halfWidth / 2);
                    context.rotate(-Math.PI / 2 + angleRadian);
                    context.transform(1, 0, 0, 1.1, 0, 0);
                    // context.transform(1.1, 0.5, 0.22 ,1.01, 0, 0);
                    context.drawImage(newImage, 0, 0, width, length);
                    context.restore();
                }
            } else {
                // vertical snakes
                context.transform(1, 0, 0.05, 1, 0, 0);
                context.drawImage(newImage, 0, halfWidth / 2, width, length);
            }
            context.restore();
        }
    };
}

function drawLadder(start, end) {
    const [[x1, y1], [x2, y2]] = getJump(start - 1, end - 1);
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

function drawPlayer(position, icon) {
    // WILL FIX!
    const x = position % gridWidth;
    const y = Math.floor(position / gridWidth);
    const playerPosX = (y % 2 == 0 ? x - 1 : gridWidth - x) * squareSize;
    const playerPosY = (gridHeight - y - 1) * squareSize;
    context.font = '30px serif';
    context.fillText(icon, playerPosX, playerPosY + squareSize / 2);
}

function initPlayers() {
    let players = JSON.parse(localStorage.getItem('players'));
    // console.log(players)
    if (players != null) {
        for (
            let player_index = 0;
            player_index < players.length;
            player_index++
        ) {
            // console.log(player_index)
            let player = players[player_index];
            let player_card_list = document.getElementById(
                'player-list-container'
            );
            let player_card = new PlayerCard();
            // console.log(player)
            player_card.player_name = player.player_name;
            player_card.player_color = player.player_color;
            player_card_list.appendChild(player_card);
            player_card_list.append(player_card);
        }
    }
}

function initGame() {
    initPlayers();
    setupPlayers();
    setupGame();
    initBoard();
}

document.body.onload = () => {
    initGame();
};

rollBtn.addEventListener('click', () => {
    rollDie();
    setTimeout(() => {
        movePlayer(diceValue);
    }, 4050);
});
