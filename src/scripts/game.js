function initBoard(){
    const canvas = document.getElementById("board");
    context = canvas.getContext("2d");
    drawBoard();
    drawLadder(100, 110, 120, 190);
    drawLadder(30, 390, 300, 100);
    drawLadder(10, 20, 10, 100);

    drawLadder(300, 490, 400, 100);
  }
  
  
  function drawBoard() {
      // size of each square
      const squareSize = 60;
      // let  colors = [ "#e91c49", "#cfcc1c", "#1281db", "#3db473"];
      
      // draw squares
      for(let i=0; i<10; i++) {
        for(let j=0; j<10; j++) {
          // randomise square colors
          // context.fillStyle =  colors[Math.floor(Math.random() * colors.length)];
          context.fillStyle = ((i+j)%2==0) ? "white":"black";
          let xOffset = j*squareSize;
          let yOffset =  i*squareSize;
          context.fillRect(xOffset, yOffset, squareSize, squareSize);
        }
      }
      // number placement
      context.fillStyle = "magenta";
      context.font = "bold 11px Arial";
      // first row
      for(let c = 1 ; c < 11; c++){
        context.fillText(c, (c-1)*60,550);
      }
      for(let c = 21; c < 31; c++){
        context.fillText(41-c, (c-21)*60,490);
      }
      for(let d = 0; d < 4; d++){
        for(let c = 21+ d*10; c < 31+d*10; c++){
          context.fillText( c + d*10, (c- (21+d*10))*60, 430- d*120);
        }
        for(let c = 31+d*10; c < 41+d*10; c++){
          context.fillText(71+ d*30 -c, (c-(31+d*10))*60, 370-d*120);
        }
      }
  
      // start and finish squares
      context.font = "bold 15px Arial";
      context.fillStyle = "magenta";
      context.fillText ('Start', 13, 570);
      context.fillText ('Finish', 13,30);
  
      // draw the border around the 
      // context.strokeStyle = "black";
      // context.strokeRect(boardTopx, boardTopy, squareSize*8, squareSize*8)
  }

  // @params : (x1, y1) - start x and y coordinates
  //         : (x2, y2) - end x and y coordinates
  function drawLadder(x1, y1, x2, y2){
    const width = 30;
    const height = y2 -y1;

    var dx= x2-x1;
    var dy= y2-y1;
    var radianAngle=Math.atan2(dy,dx);
    var midX=(x2+x1)/2;
    var midY=(y2+y1)/2;
  
    context.strokeStyle = 'green';
    context.lineWidth = 6;
    context.save();
    // context.translate(midX,midY);
    radianAngle < 0 ? context.rotate(radianAngle) : null;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x1, y2);
    context.moveTo((x1 + width), y1);
    context.lineTo(x1 + width, y1+height);
    context.stroke();
    // context.moveTo(x1, y1);
    // context.lineTo(x2, y2);
    // context.moveTo((x1 + width), y1);
    // context.lineTo(x2 + width, y2);
    // context.stroke();

    let numSteps = height/19 ;
    
    let xOffset = 0;
    let yOffset = 0;
    let stepOffset = (y1 < y2) ? y1 : y2;
    // draw steps
    for(let i = 1; i < Math.abs(numSteps) -1; i +=1){
        xOffset = x1 ;
        yOffset = stepOffset  + (i * 20);
        console.log(y1 - height, numSteps, height, radianAngle)
        // xOffset = x1 + ((i-1)*6);
        // yOffset = (y1 *i) + 7;

        context.moveTo(xOffset , yOffset);
        context.lineTo(xOffset + width, yOffset);

      // context.moveTo(xOffset , yOffset);
      // context.lineTo(xOffset + width, yOffset);
      context.stroke();   
    }
    
    context.closePath();
    context.restore();
    // context.fillRect(x, y, 6, height);
    // context.fillRect(x + width, y, 6, height);
  }
    
  // function drawLadder(x, y, width, height){
  //   // const width = 30;
  
  //   context.fillStyle = 'green';
    
  //   context.fillRect(x, y, 6, height);
  //   context.fillRect(x + width, y, 6, height);
  
  //   // draw steps
  //   for(let i = 20; i <100; i +=15){
  //         context.fillRect(x, i, 30, 6);
  //   }
  
  // }
    
  