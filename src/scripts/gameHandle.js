// we have dice value
// now get position of snakes and ladders
// now place player on board

const numRows = 10; // Number of rows in the board
const numColumns = 10; // Number of columns in the board

let players = JSON.parse(localStorage.getItem('players'));

function getRandomIcon(Icons, usedIcons) {
    const availableIcons = Icons.filter(icon => !usedIcons.includes(icon));
    const randomIndex = Math.floor(Math.random() * availableIcons.length);
    return availableIcons[randomIndex];
  }
  

function setupPlayers() {
    // let players = JSON.parse(localStorage.getItem('players'));
    // place players on the board
    const icons = ['🐤', '🥚', '🦚', '🐾'];
    const usedIcons = [];
    const start = '1';

    players = players.map((player) => {
        const randomIcon = getRandomIcon(icons, usedIcons);
        usedIcons.push(randomIcon);
        return {
            player_color: player.player_color,
            player_name: player.player_name,
            icon: randomIcon,
            isPlayersTurn: 0,
            currentPosition : parseInt(start),
        }
    });


}
  
// Function to get coordinates of a cell by its value on the 10X10 grid
function getCellCoordinates(cellValue) {
    const row = Math.floor((cellValue - 1) / numColumns);
    const isEvenRow = row % 2 === 0;
    const column = isEvenRow
        ? (cellValue - 1) % numColumns
        : numColumns - 1 - ((cellValue - 1) % numColumns);
    return { row, column };
}

// Snake positions (start -> end)
function snakePositions( snakesArray ){

    // let tempSnakes = state.board.snakes;
    let coordinates = snakesArray.map((element) => {
        return {
            value : element,
            row : getCellCoordinates(element).row,
            column : getCellCoordinates(element).column,
        }}
    );
    let snakes = [];
    let matchedValues;

    // get postions that are atleast 3 rows and cols apart
    for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
            const diffRow = Math.abs(coordinates[i].row - coordinates[j].row);
            const diffColumn = Math.abs(coordinates[i].column - coordinates[j].column);
            if (diffRow >= 3 && diffColumn >= 3) {
                // order positions (start , end)
                if (coordinates[i].row < coordinates[j].row){
                    matchedValues = [coordinates[j].value, coordinates[i].value];
                } else{
                    matchedValues = [coordinates[i].value, coordinates[j].value];
                }
                snakes.push(matchedValues);
                coordinates.splice(i, 1);
                coordinates.splice(j - 1, 1);
            } 
            else if(diffColumn === 0 && diffRow === 3) {
                // order positions (end , start)
                if (coordinates[i].row > coordinates[j].row){
                    matchedValues = [coordinates[i].value, coordinates[j].value];
                } else{
                    matchedValues = [coordinates[j].value, coordinates[i].value];
                }
                snakes.push(matchedValues);
                coordinates.splice(i, 1);
                coordinates.splice(j - 1, 1);
            }
        }
    }
    return snakes;
}

// Ladder positions (end -> start)
function ladderPositions( laddersArray ){
    // let tempLadders = state.board.ladders;
    let coordinates = laddersArray.map((element) => {
        return {
            value : element,
            row : getCellCoordinates(element).row,
            column : getCellCoordinates(element).column,
        }}
    );
    let ladders = [];
    let matchedValues;

    // get postions that are atleast 2 rows and cols apart
    for (let i = 0; i < coordinates.length; i++) {
        for (let j = i + 1; j < coordinates.length; j++) {
            const diffRow = Math.abs(coordinates[i].row - coordinates[j].row);
            const diffColumn = Math.abs(coordinates[i].column - coordinates[j].column);
            if (diffRow >= 2 || diffColumn >= 2) {
                // order positions (end , start)
                if (coordinates[i].row > coordinates[j].row){
                    matchedValues = [coordinates[i].value, coordinates[j].value];
                } else{
                    matchedValues = [coordinates[j].value, coordinates[i].value];
                }
                ladders.push(matchedValues);
                coordinates.splice(i, 1);
                coordinates.splice(j - 1, 1);
            } else if(diffColumn === 0 && diffRow === 3) {
                // order positions (end , start)
                if (coordinates[i].row > coordinates[j].row){
                    matchedValues = [coordinates[i].value, coordinates[j].value];
                } else{
                    matchedValues = [coordinates[j].value, coordinates[i].value];
                }
                ladders.push(matchedValues);
                coordinates.splice(i, 1);
                coordinates.splice(j - 1, 1);
            }
        }
    }

    return ladders;
}
