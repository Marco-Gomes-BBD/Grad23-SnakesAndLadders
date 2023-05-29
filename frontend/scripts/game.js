import { GamePlayerCard } from './game_player_card.js';

const canvas = document.getElementById('board');
let context = canvas.getContext('2d');

let gridWidth = 10;
let gridHeight = 10;
let gridSize = gridWidth * gridHeight;

let squareSize =
    Math.min(canvas.width, canvas.height) / Math.max(gridHeight, gridWidth);
const colors = ['white', 'black'];

let ladders = [];
let snakes = [];

let players = [];
const currentPlayer = document.getElementById('current-player');
let playerIndex = 0;

const resources = {};
function loadResources(paths, callback) {
    const categories = Object.keys(paths);
    const totalResources = categories.reduce(
        (total, key) => total + paths[key].length,
        0
    );
    let successResources = 0;
    let errorResources = 0;

    function onResourceLoad(category, index, image) {
        if (!resources.hasOwnProperty(category)) resources[category] = [];
        resources[category][index] = image;

        if (image !== null) successResources++;
        else errorResources++;

        const total = successResources + errorResources;
        if (total === totalResources) callback();
    }

    function loadListener(category, path, index) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                onResourceLoad(category, index, image);
                resolve();
            };
            image.onerror = (error) => {
                console.error(`Failed to load ${category} resource:`, error);
                onResourceLoad(category, index, null);
                reject();
            };
            image.src = path;
        });
    }

    categories.forEach((category) => {
        const categoryPaths = paths[category];
        categoryPaths.map((path, index) => loadListener(category, path, index));
    });
}

function movePlayer(moves) {

    playerIndex = state.roll.count % state.players.length;
    animatePlayer(players[playerIndex], moves);
    
    gameStep(moves, state.players, state.board, state.roll);
    players.forEach((player, index) => {
        player.currentPosition = state.players[index];
    });
    playerIndex = state.roll.count % state.players.length;
    currentPlayer.textContent = players[playerIndex].player_icon;

    if(player.currentPosition == 100){
        rollBtn.disable();
    }

}

function animatePlayer(player, moves) {
    const duration = 500;
    const jumpHeight = 60; 
    const jumpDistance = 60;
    const [x, y] = getCellPosition(player.currentPosition);
    let startY = y; 
    let startX = x;

    let remainingMoves = moves;

    const startingRow = Math.floor(startY / jumpDistance);
    const initialDirection = startingRow % 2 === 0 ? -1 : 1;

    let direction =  initialDirection;
  
    function jump() {
      const startTime = Date.now();
  
      function update() {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentX = startX + direction * jumpDistance * progress;
        const currentY = startY - jumpHeight * Math.abs(Math.sin(progress * Math.PI));
  
        (startX !=0 && startY !=0) && updateBoard(player, currentX, currentY);
  
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          startX = currentX; 
          startY = currentY; 
          if(startX >= 540 && direction === 1){
            startY -= jumpDistance;
            direction = startY / jumpDistance % 2 === 0 ? -1 : 1;
            remainingMoves--;
          } else if(startX === 0 && direction === -1){
            startY -= jumpDistance;
            direction = startY / jumpDistance % 2 === 0 ? -1 : 1;
            remainingMoves--;
          }
          
          remainingMoves--;
  
          if (remainingMoves > 0) {
            jump();
          }
        }
      }
  
      update();
    }
  
    jump();
  }

function updateBoard(player, currentX, currentY) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();

    ladders.forEach((ladder) => {
        drawLadder(ladder[0], ladder[1]);
    });

    const prng = new Math.seedrandom(state.board.seed);
    snakes.forEach((snake) => {
        drawSnake(snake[0], snake[1], prng);
    });

    players.forEach((p, index) => {
        p === player ? 
        drawAnimPlayer(currentX, currentY, player.player_icon) :
        drawPlayer(p.currentPosition, p.player_icon);
    });
}

function initBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();

    ladders.forEach((ladder) => {
        drawLadder(ladder[0], ladder[1]);
    });

    const prng = new Math.seedrandom(state.board.seed);
    snakes.forEach((snake) => {
        drawSnake(snake[0], snake[1], prng);
    });

    players.forEach((player) => {
        drawPlayer(player.currentPosition, player.player_icon);
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
    const num = getRandomInt(prng, 0, resources.snakes.length);
    const image = resources.snakes[num];
    if (image === null) return;

    const [[x1, y1], [x2, y2]] = getJump(head, tail);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angleRadian = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);

    context.save();
    context.translate(x1, y1);
    context.rotate(angleRadian);

    context.strokeStyle = 'red';
    context.lineWidth = 5;

    const width = image.width / 10;
    const height = length;
    context.beginPath();
    /*
    if (false) {
        context.moveTo(0, 0);
        context.lineTo(length, 0);
        context.stroke();
        context.closePath();
    }
    */
    context.rotate(-Math.PI * 0.5);
    context.drawImage(image, -width / 2, 0, width, height);

    context.restore();
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

function drawPlayer(position, icon) {
    const [x, y] = getCellPosition(position);
    context.font = '30px serif';
    context.fillText(icon, x, y + squareSize / 2);
}

function drawAnimPlayer(x, y, icon) {
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
            currentPosition: state.players[index],
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
    let game_summary = JSON.parse(localStorage.getItem('game_summary'));
    initState(game_summary);
    gridWidth = game_summary.board.width;
    gridHeight = game_summary.board.height;

    squareSize =
        Math.min(canvas.width, canvas.height) / Math.max(gridHeight, gridWidth);

    ladders = ladderPositions(state.board.board);
    snakes = snakePositions(state.board.board);

    players = game_summary.players;
    playerIndex = state.roll.count % state.players.length;

    setupPlayers();
    initPlayers();
    initBoard();
}

document.body.onload = () => {
    const paths = {
        snakes: [
            '/res/snakes/snake1.png',
            '/res/snakes/snake2.png',
            '/res/snakes/snake3.png',
        ],
    };

    loadResources(paths, () => {
        initGame();
    });
};

function advanceGame(count) {
    let game = JSON.parse(localStorage.getItem('game_summary'));
    let details = JSON.parse(localStorage.getItem('user-details'));
    game.roll.count = count;
<<<<<<< HEAD
    console.log(game);
=======

>>>>>>> develop
    localStorage.setItem('game_summary', JSON.stringify(game));
    if (details != null) {
        fetch(
            '/game/update?user=' +
                details.id +
                '&game_id=' +
                game.game_id +
                '&rolls=' +
                count +
                '&winner=' +
                null
        );
    }
}

rollBtn.addEventListener('click', () => {
    const roll = rollDie(state.roll.prng);
    playerIndex = state.roll.count % state.players.length;
    currentPlayer.textContent = players[playerIndex].player_icon;
    setTimeout(() => {
        movePlayer(roll);
        advanceGame(state.roll.count);
    }, 4050);
});
