const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbName = './db/state.db';
const initSql = `${dbName}.init.sql`;

let db = new sqlite3.Database(dbName, (err) => {
    if (err) return console.error(err.message);
    console.log(`Connected to SQLite database: ${dbName}`);
});

function rowToGame(row) {
    return {
        index: row.index,
        board: {
            width: row.board_width,
            height: row.board_height,
            seed: row.board_seed,
        },
        roll: {
            seed: row.roll_seed,
            count: row.roll_count,
            win: row.winner,
        },
    };
}

function rowsToGames(rows) {
    if (rows) return rows.map(rowToGame);
    else return [];
}

function runFile(file, delimiter = ';') {
    const dataSql = fs.readFileSync(file).toString();
    const sqlStatements = dataSql.toString().split(delimiter);

    db.serialize(() => {
        sqlStatements.forEach((statement) => {
            statement = statement.trim();
            if (statement) {
                db.run(`${statement}${delimiter}`, (err) => {
                    if (err) throw err;
                });
            }
        });
    });
}

function close() {
    db.close((err) => {
        if (err) return console.error(err.message);
        console.log('Closed the database connection.');
    });
}

function getUser(tokenDetails) {
    return new Promise((resolve, reject) => {
        const userId = tokenDetails.id;
        db.get(
            'SELECT "index" FROM "User" WHERE "index" = ?',
            [userId],
            (err, row) => {
                if (err) reject(err);
                else if (row) resolve(row.index);
                else resolve(null);
            }
        );
    });
}

function registerUser(tokenDetails) {
    return new Promise((resolve, reject) => {
        const userId = tokenDetails.id;
        db.run(
            'INSERT INTO "User" ("index") VALUES (?)',
            [userId],
            function (err) {
                if (err) reject(err);
                else resolve(userId);
            }
        );
    });
}

function newGame(user, game) {
    return new Promise((resolve, reject) => {
        const { board, roll, players } = game;

        db.run(
            `
            INSERT INTO "Game" ("board_width", "board_height", "board_seed", "roll_seed", "roll_count", "winner")
            VALUES (?, ?, ?, ?, ?, NULL)
            `,
            [board.width, board.height, board.seed, roll.seed, roll.count],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    const gameId = this.lastID;
                    const playerValues = []
                    players.forEach((player) => {
                        playerValues.push(player.player_name);
                        playerValues.push(player.player_color)
                        playerValues.push(user)
                    });

                    let player_insert = 'INSERT INTO "Player" ("name", "colour", "user") VALUES (?, ?, ?)';
                    for (let i = 1; i < players.length; i++) { player_insert += ', (?,?,?)' }

                    db.run(
                        player_insert,
                        playerValues,
                        function (err) {
                            if (err) {
                                reject(err);
                            } else {
                                const playerIds = Array.from(
                                    { length: this.changes },
                                    (_, index) => this.lastID - index
                                );
                                const gamePlayerValues = []
                                playerIds.forEach(
                                    (playerId) => {
                                        gamePlayerValues.push(gameId)
                                        gamePlayerValues.push(playerId)
                                    }
                                );
                                
                                let game_player_insert = 'INSERT INTO "GamePlayer" ("gameIndex", "playerIndex") VALUES (?, ?)'
                                for (let i = 1; i < players.length; i++) { game_player_insert += ', (?,?)' }

                                db.run(
                                    game_player_insert,
                                    gamePlayerValues,
                                    function (err) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(gameId);
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    });
}

function getGame(user, id) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT g."index", g."board_width", g."board_height", g."board_seed", g."roll_seed", g."roll_count", g."winner", p."name", p."colour", p."playerIndex"
            FROM "Game" AS g
            INNER JOIN "GamePlayer"
            AS gp ON g."index" = gp."gameIndex"
            INNER JOIN "Player" AS p ON gp."playerIndex" = p."index"
            WHERE g."index" = ? AND p."user" = ?
            `,
            [id, user],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length > 0) {
                    const game = rowToGame(rows[0]);
                    game.players = rows.map((row) => ({
                        player_name: row.name,
                        player_color: row.colour,
                        player_index: row.playerIndex,
                    }));
                    resolve(game);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

function advanceGame(user, gameId, steps, winner) {
    return new Promise((resolve, reject) => {
        db.run(
            `
            UPDATE "Game"
            SET "roll_count" = "roll_count" + ?, "winner" = ?
            WHERE "index" = ?
            AND "index" IN (
                SELECT "gameIndex" FROM "GamePlayer"
                INNER JOIN "Player" ON "GamePlayer"."playerIndex" = "Player"."index"
                WHERE "Player"."user" = ?
            )
            `,
            [steps, winner, gameId, user],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
}

function getLoadGames(user) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT g."index", g."board_width", g."board_height", g."board_seed", g."roll_seed", g."roll_count", g."winner", p."name", p."colour", p."playerIndex"
            FROM "Game" AS g
            INNER JOIN "GamePlayer" AS gp ON g."index" = gp."gameIndex"
            INNER JOIN "Player" AS p ON gp."playerIndex" = p."index"
            WHERE g."winner" IS NULL AND p."user" = ?
            `,
            [user],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rowsToGames(rows));
                }
            }
        );
    });
}

function getHistory(user) {
    return new Promise((resolve, reject) => {
        db.all(
            `
            SELECT g."index", g."board_width", g."board_height", g."board_seed", g."roll_seed", g."roll_count", g."winner"
            FROM "Game" AS g
            INNER JOIN "GamePlayer" AS gp ON g."index" = gp."gameIndex"
            INNER JOIN "Player" AS p ON gp."playerIndex" = p."index"
            WHERE g."winner" IS NOT NULL AND p."user" = ?
            `,
            [user],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rowsToGames(rows));
                }
            }
        );
    });
}

runFile(initSql);

const api = {
    getUser,
    registerUser,
    newGame,
    getGame,
    advanceGame,
    getLoadGames,
    getHistory,
};
module.exports = { close, api };
