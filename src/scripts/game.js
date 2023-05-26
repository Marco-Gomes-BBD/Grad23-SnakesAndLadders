import { GamePlayerCard } from './game_player_card.js';

const canvas = document.getElementById('board');
let context = canvas.getContext('2d');

let gridWidth = 10;
let gridHeight = 10;
let gridSize = gridWidth * gridHeight;

let squareSize = Math.min(canvas.width, canvas.height)/Math.max(gridHeight, gridWidth);
const colors = ['white', 'black'];

let ladders = [];
let snakes = [];
const snakeImages = [];

let players = [];
const currentPlayer = {};
let playerIndex = 0;

function loadResources() {
    const paths = [];
    paths[0] = '/res/snakes/snake1.png';
    paths[1] = '/res/snakes/snake2.png';
    paths[2] = '/res/snakes/snake3.png';

    paths.forEach((src) => {
        const image = new Image();
        image.src = src;
        snakeImages.push(image);
    });
}

function movePlayer(moves) {
    gameStep(moves, state.players, state.board, state.roll);
    players.forEach((player, index) => {
        player.currentPosition = state.players[index];
    });

    initBoard();
    playerIndex = state.roll.count % state.players.length;
    currentPlayer.textContent = players[playerIndex].player_icon;
}

function initBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();

    ladders.forEach((ladder) => {
        drawLadder(ladder[0], ladder[1]);
    });

    const prng = new Math.seedrandom('snakes');
    snakes.forEach((snake) => {
        drawSnake(snake[0], snake[1], prng);
    });

    players.forEach((player, index) => {
        drawPlayer(player.currentPosition, index, player.player_icon);
    });
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
            let xOffset = x * squareSize;
            let yOffset = y * squareSize;
            context.fillStyle = colors[index % colors.length];
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

function drawSnake(head, tail, prng) {
    // get random snake
    const num = getRandomInt(prng, 1, 4);
    const image = snakeImages[num];

    const width = 65;
    const halfWidth = Math.floor(width / 2);
    const [[startx, starty], [endx, endy]] = getJump(head, tail);
    const dx = endx - startx;
    const dy = endy - starty;
    const angleRadian = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    const xOffset = startx / 60 - endx / 60;
    if (image.complete) {
        context.save();
        context.translate(startx, starty);

        if (Math.abs(xOffset) !== 1) {
            if (startx / 60 < endx / 60) {
                // left to right
                context.save();
                context.translate(0, halfWidth);
                context.rotate(-Math.PI / 2 + angleRadian);
                context.transform(1, 0, -0.05, 1.1, 0, 0);
                context.drawImage(image, 0, 0, width, length);
                context.restore();
            } else {
                // right to left
                context.save();
                context.translate(0, -halfWidth / 2);
                context.rotate(-Math.PI / 2 + angleRadian);
                context.transform(1, 0, 0, 1.1, 0, 0);
                // context.transform(1.1, 0.5, 0.22 ,1.01, 0, 0);
                context.drawImage(image, 0, 0, width, length);
                context.restore();
            }
        } else {
            // vertical snakes
            context.transform(1, 0, 0.05, 1, 0, 0);
            context.drawImage(image, 0, halfWidth / 2, width, length);
        }

        context.restore();
    } else {
        console.log('Snake could not be drawn.');
    }
}

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

function drawPlayer(position, index, icon) {
    const [x, y] = getCellPosition(position);
    context.font = '30px serif';
    context.fillText(icon, x, y + squareSize / 2);
}

function initPlayers() {
    if (players != null) {
        
        for (
            let player_index = 0;
            player_index < players.length;
            player_index++
        ) {
            let player = players[player_index];
            let template = document.getElementById('player-card-template');
            let player_card = new GamePlayerCard(template);
            let player_card_list = document.getElementById(
                'player-list-container'
            );
            player_card.player_name = player.player_name;
            player_card.player_color = player.player_color;
            player_card.player_icon = player.player_icon;
            player_card_list.append(player_card);
            player_card_list.appendChild(player_card);
        }
    }
}

function setupPlayers() {
    const icons = ['🐤', '🥚', '🦚', '🐾'];
    
    players = players.map((player, index) => {
        const icon = icons[index];
        return {
            player_color: player.player_color,
            player_name: player.player_name,
            player_icon: icon,
            currentPosition: 0,
        };
    });
    currentPlayer.textContent = players[playerIndex].player_icon;
}

// Snake positions (start -> end)
function snakePositions(board) {
    const snakes = [];
    board.forEach((offset, index) => {
        if (offset < 0) snakes.push([index, index + offset]);
    });

    return snakes;
}

// Ladder positions (end -> start)
function ladderPositions(board) {
    const ladders = [];
    board.forEach((offset, index) => {
        if (offset > 0) ladders.push([index, index + offset]);
    });

    return ladders;
}

function initGame() {
    let game_summary = JSON.parse(localStorage.getItem("game_summary"))
    console.log(game_summary)
    initState(game_summary);
    gridWidth = game_summary.board.width
    gridHeight = game_summary.board.height

    squareSize = Math.min(canvas.width, canvas.height)/Math.max(gridHeight, gridWidth)

    ladders = ladderPositions(state.board.board);
    snakes = snakePositions(state.board.board);

    players = game_summary.players;
    playerIndex = state.roll.count % state.players.length;
    //currentPlayer = players[playerIndex];

    setupPlayers();
    initPlayers();
    initBoard();
}

document.body.onload = () => {
    loadResources();
    setTimeout(initGame, 200);
};

rollBtn.addEventListener('click', () => {
    const roll = rollDie();
    playerIndex = state.roll.count % state.players.length;
    currentPlayer.textContent = players[playerIndex].player_icon;
    setTimeout(() => {
        movePlayer(roll);
    }, 4050);
    
});
