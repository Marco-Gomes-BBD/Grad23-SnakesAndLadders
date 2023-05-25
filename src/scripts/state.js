function getRandomInt(prng, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(prng() * (max - min) + min);
}

function generateBoard(summary) {
    const { width, height } = summary;
    const size = width * height;
    const board = Array(size).fill(0);

    // TODO: Decide how we want to define snake and ladder count.
    const numSnakes = Math.floor(6);
    const numLadders = Math.floor(7);
    const prng = new Math.seedrandom(summary.seed);

    for (let i = 0; i < numSnakes; i++) {
        const start = getRandomInt(prng, width, size - 1);

        const minDelta = (start % width) + 1;
        const maxDelta = start + 1;
        const delta = -getRandomInt(prng, minDelta, maxDelta);

        board[start] = delta;
    }

    for (let i = 0; i < numLadders; i++) {
        const start = getRandomInt(prng, 1, size - width);

        const minDelta = width - (start % width);
        const maxDelta = size - start;
        const delta = getRandomInt(prng, minDelta, maxDelta);

        board[start] = delta;
    }

    return { board, width, height };
}

function gameStep(die, players, board, roll) {
    const player = roll.count % players.length;
    let position = players[player];
    position += die;

    const jump = board.board[position];
    position += jump ?? -die;
    players[player] = position;

    if (position >= board.board.length - 1 && !roll.win) {
        roll.win = roll.count + 1;
    }
    roll.count += 1;
}

function getRollState(summary, players, board) {
    const roll = {
        seed: summary.seed,
        count: 0,
    };

    const rollMin = 1;
    const rollMax = 6 + 1;
    const prngRoll = new Math.seedrandom(roll.seed);
    const rolls = Array.from({ length: summary.count }, () =>
        getRandomInt(prngRoll, rollMin, rollMax)
    );

    rolls.forEach((die) => gameStep(die, players, board, roll));
    return roll;
}

function getState(summary) {
    const board = generateBoard(summary.board);
    const playerCount = summary.players.length;
    const players = Array(playerCount).fill(0);
    const roll = getRollState(summary.roll, players, board);

    return { board, players, roll };
}

function printBoard(state) {
    const { width, height } = state;
    for (let y = 0; y < height; y++) {
        let print = '';
        for (let x = 0; x < width; x++) {
            const jmp = state.board[y * width + x];
            print += `|${String(jmp).padStart(3)}`;
        }
        print += '|';
        console.log(print);
    }
}

let summary = {};
let state = {};
let pretty = {};

function initState(new_summary) {
    summary = new_summary
    state = getState(summary);
    pretty = { roll: state.roll, players: state.players };
}


// console.log(JSON.stringify(pretty, undefined, 1));
// printBoard(state.board);
