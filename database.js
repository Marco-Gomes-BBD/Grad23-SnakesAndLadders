const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbName = './db/state.db';
const initSql = `${dbName}.init.sql`;

let db = new sqlite3.Database(dbName, (err) => {
    if (err) return console.error(err.message);
    console.log(`Connected to SQLite database: ${dbName}`);
});

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

runFile(initSql);

module.exports = { close };
