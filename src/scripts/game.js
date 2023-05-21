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


    // bacause of image restrications distance between head and tail needs to be greater that 3 blocks, both vertically and horrizontally
    // head can't be a border cell 
    // drawSnake(59, 19); 
    // drawSnake(86, 55);
    // drawSnake(77, 24);
    // drawSnake(63 ,10);
    // drawSnake(23 ,10);
    // drawSnake(62 ,30);
    drawSnake(79, 35);
    // drawSnake(88, 16);  ``
    // drawSnake(66,34)
    // drawSnake(52, 34);

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


function drawSnake(head, tail){
    let newImage = new Image();
    let ImageArray = new Array();
    ImageArray[0] = '/res/snakes/snake1.png';
    ImageArray[1] = '/res/snakes/snake2.png';
    ImageArray[2] = '/res/snakes/snake3.png';

    // get random snake
    let num = Math.floor( Math.random() * 3);
    let img = ImageArray[num];

    newImage.src = img;


    let width = 75;
    const halfWidth = Math.floor(width / 2);
    const [[x1, y1], [x2, y2]] = getJump(head-1, tail);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angleRadian = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    const [startx, starty] = getCellPosition(head - 1);
    const [endx, endy] = getCellPosition(tail);
    
    const xOffset = (startx/60)- (endx/60);
    const yOffset = (endy - starty)/60;
    
    newImage.onload = function(){
        context.save();
        context.translate(startx , starty);
        if(Math.abs(xOffset) !== 1 ){
        
            if((startx/60)< (endx/60)){
                // left to right
                context.save();
                context.translate(-halfWidth/2, halfWidth );
                context.rotate(-Math.PI/2 + (angleRadian ));
                context.transform(1,0.5,-0.1,1.1, yOffset, 0);
                context.drawImage(newImage, 0 , 0 , width, length);
                console.log(yOffset/60);
                context.restore();

            }
            else{
                // right to left
                context.save();
                context.translate(0 , -halfWidth/2);
                context.rotate(-Math.PI/2 + angleRadian);
                context.transform(1.1, 0.5, 0.22 ,1.01, 0, 0);
                context.drawImage(newImage, 0, 0, width, length);
                context.restore();
            }
        }
        else{
            // vertical snakes
            context.drawImage(newImage, 0, halfWidth/2, width, length);
        }
        console.log(head, startx, tail, endx, angleRadian, yOffset);
        context.restore();
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
