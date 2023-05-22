function getRandomInt(prng, min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(prng() * (max - min) + min);
}

const summary = {
    board: {
        seed: 'Hello',
        width: 10,
        height: 10,
    },
    roll: {
        seed: 'World',
        count: 26,
    },
    players: 2,
};

function generateBoard(summary) {
    const { width, height } = summary;
    const size = width * height;
    const board = Array(size).fill(0);

    // TODO: Decide how we want to define snake and ladder count.
    const numSnakes = Math.floor(size / 10);
    const numLadders = Math.floor(size / 10);
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

function getRollState(summary, players, board) {
    const roll = {
        seed: summary.seed,
        count: summary.count,
    };

    const rollMin = 1;
    const rollMax = 6 + 1;
    const prngRoll = new Math.seedrandom(roll.seed);
    const rolls = Array.from({ length: roll.count }, () =>
        getRandomInt(prngRoll, rollMin, rollMax)
    );

    rolls.forEach((die, index) => {
        const player = index % players.length;

        // TODO: Extract this to be a game step.
        let position = players[player];
        position += die;

        const jump = board.board[position];
        position += jump ?? -die;
        players[player] = position;

        if (position >= board.board.length - 1 && !roll.win) {
            roll.win = index + 1;
        }
    });

    return roll;
}

function getState(summary) {
    const board = generateBoard(summary.board);

    const playerCount = summary.players;
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

const state = getState(summary);
const pretty = { roll: state.roll, players: state.players };
// console.log(JSON.stringify(pretty, undefined, 1));
// printBoard(state.board);
