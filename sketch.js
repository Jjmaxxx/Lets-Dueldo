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
function setup(){
    frameRate(60);
    background(0);
    let canvas = createCanvas(windowWidth, windowHeight);
    drawPrompt = createDiv("");  
    drawPrompt.position(windowWidth/2, 20);
    roundNumber = createDiv("");
    roundNumber.position(10,10);
    p1Total = createDiv("");
    p1Total.position(windowWidth/4, windowHeight-50);
    p2Total = createDiv("");
    p2Total.position(windowWidth * 3/4, windowHeight-50);
    timer = createDiv("");
    timer.position(10,20);
    displayWinner = createDiv("");
    displayWinner.position(windowWidth/2 - 200, windowHeight/2);
    displayWinner.style('font-size', '50px');

    socket = io.connect("http://localhost:3000");
    socket.on("readyButton",(ready)=>{
        if(ready){
            startGame = createButton("Start Game");
            startGame.position(windowWidth/2,windowHeight/2);
            startGame.mousePressed(function(){startGame.remove();socket.emit('newRound');});
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
            drawPrompt.html("");
            displayWinner.html("");
            p1Total.html("");
            p2Total.html("");
            roundNumber.html("");
            timer.html("");
            fill('white');
            rect(0, 30, windowWidth/2 - 2,windowHeight);
            rect(windowWidth/2 + 2, 30, windowWidth/2, windowHeight);
        }else if(roundVar[1] > 1 && (playerNumber != 1 || playerNumber != 2)){
            voteP1.remove();
            voteP2.remove();
        }
        console.log(roundVar[0], roundVar[1]);
        hasVoted=false;
        canDraw=true;
        startGame.remove();
        drawPrompt.html(roundVar[0]);
        roundNumber.html("Round: " + roundVar[1]);
    })
    socket.on('resetRound',()=>{
        socket.emit('newRound');
    })
    socket.on('voting',()=>{
        canDraw = false;
        if(isPlaying == false){
            voteP1 = createButton("vote");
            voteP1.position(windowWidth/4, windowHeight-100);
            voteP2 = createButton("vote");
            voteP2.position(windowWidth * 3/4, windowHeight-100);
            voteP1.mousePressed(function(){if(hasVoted==false){socket.emit("vote", 1);hasVoted=true;}});
            voteP2.mousePressed(function(){if(hasVoted==false){socket.emit("vote", 2);hasVoted=true;}});
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
        displayWinner.html(playerWin[0] + " wins with " + playerWin[1] + " votes!");
    })
    socket.on('tie', (votes)=>{
        displayWinner.html("Both Players got " + votes + " vote, it's a draw!");

    })
    socket.on("timer",(timeLeft)=>{
        if(timer == null){
            timer.html("Time Left: " + timeLeft);
        }
        timer.html("Time Left: "+timeLeft);
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
            rect(0, 30, windowWidth/2 - 2,windowHeight);
            noStroke();
        }else{
            fill('white'); 
            rect(windowWidth/2 + 2, 30, windowWidth/2, windowHeight); 
            noStroke();
        }
    })
    socket.on('playerNumber', (num)=>{
        playerNumber = num;
        console.log("I am player: " + playerNumber);
        isPlaying = true;
    });
    clearBoardP1 = createButton("Clear");
    clearBoardP1.position(windowWidth/2 - 90, 0);
    clearBoardP1.mousePressed(function(){if(playerNumber == 1){fill('white'); rect(0, 30, windowWidth/2 - 2,windowHeight); noStroke();socket.emit("clear", 1)}})
    clearBoardP2 = createButton("Clear");
    clearBoardP2.position(windowWidth/2 + 50, 0);
    clearBoardP2.mousePressed(function(){if(playerNumber == 2){fill('white'); rect(windowWidth/2 + 2, 30, windowWidth/2, windowHeight); noStroke();socket.emit("clear", 2)}});
    //just an event to toggle the turn on or off /
    //send the id of the socket whos turn it is to every user, then the client can figure out if its their turn
    //socket.on("toggleTurn",isMyturn) => {myTurn = isMyturn}
    //git branch nbame


    
}
function draw(){
    line(windowWidth/2, windowHeight, windowWidth/2, -windowHeight);
}
function mouseDragged(){
    let data = {
        x: mouseX,
        y: mouseY,
        playerNum: playerNumber
    }
    if(playerNumber == 1 && canDraw == true){
        if(data.x < windowWidth/2 - 50 && data.y > 75){
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
