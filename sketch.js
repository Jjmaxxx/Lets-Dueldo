let socket;
let playerNumber;
let timer;
let p1Total,p2Total;
function setup(){
    frameRate(60);
    background(0);
    let canvas = createCanvas(windowWidth, windowHeight);
    startGame = createButton("Start Game");
    startGame.position(windowWidth/2,windowHeight/2);
    startGame.mousePressed(function(){socket.emit('newRound');startGame.remove()});
    socket = io.connect("http://localhost:3000");
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
    socket.on("newRound",(prompt)=>{
        startGame.remove();
        text(prompt, windowWidth/2, 20);
    })
    socket.on('voting',()=>{
        voteP1 = createButton("vote");
        voteP1.position(windowWidth/4, windowHeight-100);
        voteP1.mousePressed(function(){socket.emit("vote", 1)});
        voteP2 = createButton("vote");
        voteP2.position(windowWidth * 3/4, windowHeight-100);
        voteP2.mousePressed(function(){socket.emit("vote", 2)});
    })
    socket.on('vote',(votes)=>{
        if(p1Total == null){
            p1Total = createDiv("Votes: " + votes[0]);
            p1Total.position(windowWidth/4, windowHeight-50);
        }
        if(p2Total == null){
            p2Total = createDiv("Votes: " + votes[1]);
            p2Total.position(windowWidth * 3/4, windowHeight-50);
        }
        p1Total.html("Votes: "+votes[0]);
        p2Total.html("Votes: "+votes[1]);
    })
    socket.on("timer",(timeLeft)=>{
        if(timer == null){
            timer = createDiv("Time Left: " + timeLeft, 100, 100);
            timer.position(10,10);
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
            rect(0, 0, windowWidth/2 - 2,windowHeight);
            noStroke();
        }else{
            fill('white'); 
            rect(windowWidth/2 + 2, 0, windowWidth/2, windowHeight); 
            noStroke();
        }
    })
    socket.on('playerNumber', (num)=>{
        playerNumber = num;
        console.log("I am player: " + playerNumber);
    });
    clearBoardP1 = createButton("Clear");
    clearBoardP1.position(windowWidth/2 - 90, 0);
    clearBoardP1.mousePressed(function(){if(playerNumber == 1){fill('white'); rect(0, 0, windowWidth/2 - 2,windowHeight); noStroke();socket.emit("clear", 1)}})
    clearBoardP2 = createButton("Clear");
    clearBoardP2.position(windowWidth/2 + 50, 0);
    clearBoardP2.mousePressed(function(){if(playerNumber == 2){fill('white'); rect(windowWidth/2 + 2, 0, windowWidth/2, windowHeight); noStroke();socket.emit("clear", 2)}});
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
    if(playerNumber == 1){
        if(data.x < windowWidth/2){
            push();
            fill('blue');
            noStroke();
            ellipse(data.x,data.y,80,80);
            pop();
            socket.emit("mouse", data);
        }
    }
    else if(playerNumber == 2){
        if(data.x > windowWidth/2){
            push();
            fill('red');
            noStroke();
            ellipse(data.x,data.y,80,80);
            pop();
            socket.emit("mouse", data);
        }
    }
}
// function countDown(){
//     while(timer >= 0){
//         console.log('a');
//         text("Time Left: " + timer, 0,0);
//         if(frameCount % 60 == 0){
//             timer --;
//         }
//     }
//     if(timer < 0){
//         socket.emit('newRound');
//     }
// }