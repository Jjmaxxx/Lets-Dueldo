let socket;
let playerNumber;
let timer;
let p1Total,p2Total;
let startGame;
let hasVoted = false;
let canDraw = false;
let isPlaying = false;
let displayWinner;
let drawPrompt;
let roundNumber;
let box;
let voteP1,voteP2;
let displayPlayer;
let votingPhase = false;
function setup(){
    frameRate(60);
    createCanvas(windowWidth, windowHeight);
    drawPrompt = createDiv("");  
    drawPrompt.position(windowWidth/2 - 90, 20);
    drawPrompt.style("color: #8f8787;");
    drawPrompt.style("font-family:Manrope");
    drawPrompt.style("font-weight:bold");
    drawPrompt.style("font-size: 40px");
    displayPlayer = createDiv("");
    displayPlayer.style("color: #8f8787;");
    displayPlayer.style("font-family:Manrope");
    displayPlayer.style("font-weight:bold");
    displayPlayer.style("font-size: 40px");
    roundNumber = createDiv("");
    roundNumber.position(10,8);
    roundNumber.style("color: #8f8787;");
    roundNumber.style("font-family:Manrope");
    p1Total = createDiv("");
    p1Total.position(windowWidth/4, windowHeight-70);
    p1Total.style("color: #8f8787;");
    p1Total.style("font-family:Manrope");
    p1Total.style("font-size: 30px");
    p2Total = createDiv("");
    p2Total.position(windowWidth * 3/4, windowHeight-70);
    p2Total.style("color: #8f8787;");
    p2Total.style("font-family:Manrope");
    p2Total.style("font-size: 30px");
    timer = createDiv("");
    timer.position(windowWidth/2 - 6,70);
    timer.style("color: #8f8787;");
    timer.style("font-family:Manrope");
    timer.style("font-size: 60px");
    displayWinner = createDiv("");
    displayWinner.position(windowWidth/2 - 330, windowHeight/2 - 90);
    displayWinner.style("color: #8f8787;");
    displayWinner.style('font-size', '88px');
    displayWinner.style("font-family:Manrope");
    displayWinner.style("background-color: #ebcbae");
    displayWinner.style("height:200px");
    displayWinner.style("width:700px");
    displayWinner.style("text-align:center;");
    displayWinner.style("visibility: hidden;");
    socket = io.connect("http://localhost:3000");
    socket.on("readyButton",(ready)=>{
        if(ready){
            if(startGame == null){
                startGame = createButton("Start Game?");
                startGame.position(windowWidth/2 - 60,windowHeight/2 - 10);
                startGame.style("background-color: #ebcbae");
                startGame.style("border: none");
                startGame.style("color: #8f8787;");
                startGame.style("padding: 15px 27px;");
                startGame.style("text-align: center;");
                startGame.style("text-decoration: none;");
                startGame.style("display: inline-block;");
                startGame.style("font-size: 16px;");
                startGame.style("border-radius: 8px;");
                startGame.style("transition-duration: 0.4s;");
                startGame.mouseOver(function(){startGame.style("box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);"); startGame.style("cursor: pointer;")});
                startGame.mouseOut(function(){startGame.style("box-shadow:none;")});
                startGame.mousePressed(function(){startGame.remove();socket.emit('newRound');});
            }
        }else if(!ready){
            startGame.remove();
        }
    })
    socket.on('mouse', (data)=>{
        if(data.playerNum == 1){
            push();
            fill('blue');
            ellipse(data.x,data.y,80,80);
            pop();
        }else if(data.playerNum == 2){
            push();
            fill('red');
            ellipse(data.x,data.y,80,80);
            pop();
        }
        noStroke();
    })
    socket.on("newRound",(roundVar)=>{
        if(roundVar[1] > 1 ){
            displayPlayer.html("");
            playerNumber = null;
            displayWinner.style("visibility: hidden;");
            drawPrompt.html("");
            displayWinner.html("");
            p1Total.html("");
            p2Total.html("");
            roundNumber.html("");
            timer.html("");
            isPlaying = false;
            votingPhase = false;
            fill('#e4f9f5');
            stroke("#8f8787");
            strokeWeight(3);
            rect(40, 60, windowWidth/2 - 100,windowHeight - 150);
            rect(windowWidth/2 + 60, 60, windowWidth/2 - 110, windowHeight - 150);
            
        }
        displayPlayer.html("You are a spectator");
        displayPlayer.position(windowWidth - 365, 20);
        console.log(roundVar[0], roundVar[1]);
        hasVoted=false;
        canDraw=true;
        startGame.remove();
        drawPrompt.html("Draw a " + roundVar[0]);
        roundNumber.html("Round: " + roundVar[1]);
        roundNumber.style("font-size: 50px;");
    })
    socket.on('resetRound',()=>{
        socket.emit('newRound');
    })
    socket.on('voting',()=>{
        canDraw = false;
        votingPhase = true;
        if(isPlaying == false){
            voteP1 = createButton("vote");
            voteP1.position(45, windowHeight-70);
            voteP1.style("background-color: #ebcbae");
            voteP1.style("border: none");
            voteP1.style("color: #8f8787;");
            voteP1.style("padding: 10px 25px;");
            voteP1.style("text-align: center;");
            voteP1.style("text-decoration: none;");
            voteP1.style("display: inline-block;");
            voteP1.style("font-size: 16px;");
            voteP1.style("border-radius: 8px;");
            voteP1.style("transition-duration: 0.4s;");
            voteP1.mouseOver(function(){voteP1.style("box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);"); voteP1.style("cursor: pointer;")});
            voteP1.mouseOut(function(){voteP1.style("box-shadow:none;")});
            voteP2 = createButton("vote");
            voteP2.position(windowWidth/2 + 70, windowHeight-70);
            voteP2.style("background-color: #ebcbae");
            voteP2.style("border: none");
            voteP2.style("color: #8f8787;");
            voteP2.style("padding: 10px 25px;");
            voteP2.style("text-align: center;");
            voteP2.style("text-decoration: none;");
            voteP2.style("display: inline-block;");
            voteP2.style("font-size: 16px;");
            voteP2.style("border-radius: 8px;");
            voteP2.style("transition-duration: 0.4s;");
            voteP2.mouseOver(function(){voteP2.style("box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);"); voteP2.style("cursor: pointer;")});
            voteP2.mouseOut(function(){voteP2.style("box-shadow:none;")});
            voteP1.mousePressed(function(){if(hasVoted==false && votingPhase == true){socket.emit("vote", 1);hasVoted=true;}});
            voteP2.mousePressed(function(){if(hasVoted==false && votingPhase == true){socket.emit("vote", 2);hasVoted=true;}});
        }
        // socket.emit('votingTime');
    });
    socket.on('vote',(votes)=>{
        if(p1Total == null){
            p1Total.html("Votes: " + votes[0]);
        }
        if(p2Total == null){
            p2Total.html("Votes: " + votes[1]);
        }
        p1Total.html("Votes: "+votes[0]);
        p2Total.html("Votes: "+votes[1]);
    })
    socket.on('winner',(playerWin)=>{
        votingPhase = false;
        displayWinner.style("visibility: visible;");
        displayWinner.html(playerWin[0] + " wins with " + playerWin[1] + " votes!");
        if(isPlaying == false){
            voteP1.remove();
            voteP2.remove();
        }
    })
    socket.on('tie', (votes)=>{
        displayWinner.style("visibility: visible;");
        displayWinner.html("Both Players got " + votes + " votes, it's a draw!");
        if(isPlaying == false){
            voteP1.remove();
            voteP2.remove();
        }
    })
    socket.on("timer",(timeLeft)=>{
        if(timer == null){
            timer.html(timeLeft);
        }
        timer.html(timeLeft);
    })
    socket.on('join',(gameState)=>{
        fill('blue');
        noStroke();
        for(let i=0; i<gameState.length; i++){
            ellipse(gameState[i].x,gameState[i].y,80,80);
        }
    });
    socket.on('clear',(num)=>{
        if(num == 1){
            fill('white'); 
            rect(40, 60, windowWidth/2 - 100,windowHeight - 150);
            noStroke();
        }else{
            fill('white'); 
            rect(windowWidth/2 + 60, 60, windowWidth/2 - 110, windowHeight - 150); 
            noStroke();
        }
    })
    socket.on('playerNumber', (num)=>{
        playerNumber = num;
        console.log("I am player: " + num);
        isPlaying = true;
        displayPlayer.html("You are Player" + num);
        displayPlayer.position(windowWidth - 310, 20);
    });
    clearBoardP1 = createButton("Clear");
    clearBoardP1.position(windowWidth/2 - 138, windowHeight - 70);
    clearBoardP1.style("background-color: #ebcbae");
    clearBoardP1.style("border: none");
    clearBoardP1.style("color: #8f8787;");
    clearBoardP1.style("padding: 10px 25px;");
    clearBoardP1.style("text-align: center;");
    clearBoardP1.style("text-decoration: none;");
    clearBoardP1.style("display: inline-block;");
    clearBoardP1.style("font-size: 16px;");
    clearBoardP1.style("border-radius: 8px;");
    clearBoardP1.style("transition-duration: 0.4s;");
    clearBoardP1.mouseOver(function(){clearBoardP1.style("box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);"); clearBoardP1.style("cursor: pointer;")});
    clearBoardP1.mouseOut(function(){clearBoardP1.style("box-shadow:none;")});
    clearBoardP1.mousePressed(function(){if(playerNumber == 1){fill('#e4f9f5'); rect(40, 60, windowWidth/2 - 100,windowHeight - 150); noStroke();socket.emit("clear", 1)}})
    clearBoardP2 = createButton("Clear");
    clearBoardP2.position(windowWidth - 127, windowHeight-70);
    clearBoardP2.style("background-color: #ebcbae");
    clearBoardP2.style("border: none");
    clearBoardP2.style("color: #8f8787;");
    clearBoardP2.style("padding: 10px 25px;");
    clearBoardP2.style("text-align: center;");
    clearBoardP2.style("text-decoration: none;");
    clearBoardP2.style("display: inline-block;");
    clearBoardP2.style("font-size: 16px;");
    clearBoardP2.style("border-radius: 8px;");
    clearBoardP2.style("transition-duration: 0.4s;");
    clearBoardP2.mouseOver(function(){clearBoardP2.style("box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);"); clearBoardP2.style("cursor: pointer;")});
    clearBoardP2.mouseOut(function(){clearBoardP2.style("box-shadow:none;")});
    clearBoardP2.mousePressed(function(){if(playerNumber == 2){fill('#e4f9f5'); rect(windowWidth/2 + 60, 60, windowWidth/2 - 110, windowHeight - 150); noStroke();socket.emit("clear", 2)}});
    //just an event to toggle the turn on or off /
    //send the id of the socket whos turn it is to every user, then the client can figure out if its their turn
    //socket.on("toggleTurn",isMyturn) => {myTurn = isMyturn}
    //git branch nbame
    background("#a6e4e7");
    //line(windowWidth/2, windowHeight, windowWidth/2, 60);
    fill('#f9f9f9');
    stroke("#8f8787");
    strokeWeight(3);
    rect(40, 60, windowWidth/2 - 100,windowHeight - 150);
    rect(windowWidth/2 + 60, 60, windowWidth/2 - 110, windowHeight - 150);
}   
function draw(){
    
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    background("#a6e4e7");
    line(windowWidth/2, windowHeight, windowWidth/2, -windowHeight);
}
function mouseDragged(){
    let data = {
        x: mouseX,
        y: mouseY,
        playerNum: playerNumber
    }
    if(playerNumber == 1 && canDraw == true){
        if(data.x < windowWidth/2 - 50 && data.y > 75 && data.x > 50 && data.y < windowHeight - 50){
            push();
            fill('blue');
            noStroke();
            ellipse(data.x,data.y,80,80);
            pop();
            socket.emit("mouse", data);
        }
    }
    else if(playerNumber == 2 && canDraw == true){
        if(data.x > windowWidth/2 + 50 && data.y > 75){
            push();
            fill('red');
            noStroke();
            ellipse(data.x,data.y,80,80);
            pop();
            socket.emit("mouse", data);
        }
    }
}
