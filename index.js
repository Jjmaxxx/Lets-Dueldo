const http = require("http");
const fs = require("fs");
const path = require('path');
let handleRequest = (request,response)=>{
    let pathName = request.url;
    if(pathName == "/"){
        pathName = "/index.html";
    }
    let extension = path.extname(pathName);

    const typeExtension = {
        ".html":"text/html",
        ".js":"text/javascript",
        "css":"text/css"
    }

    //if file type spits out empty string/doesnt match file types in dictionary pick text/plain
    let contentType = typeExtension[extension] || "text/plain";
    fs.readFile(__dirname + pathName,(error,data)=>{
        if(error){
            response.writeHead(500);
            return(response.end("error loading message"));
        }else{
            response.writeHead(200, {
                'Content-Type':contentType
            });
            response.end(data);
        }
    })
};
const server = http.createServer(handleRequest);
server.listen(3000);
console.log("running on port 3000");

//create a list of data objects that represents the order of keystrokes sent by users
let gameState = [
    
];
let gameStateP1 = [

];
let gameStateP2 = [

];

let prompts = ["Cat","Dog","Parrot","Elephant","Giraffe"];
let users = [];
let randNum;
let player1;
let p1Votes = 0;
let p2Votes = 0;
let roundNum = 0;
let gameStarted = false;
let ready = false;
let io = require("socket.io").listen(server);
let playerWonTimer = 5;

function newRound(){
    let startRound = setInterval(function(){
        playerWonTimer--;
        io.emit('timer', playerWonTimer);
        if(playerWonTimer <= 0){
            clearInterval(startRound);
            io.to(users[0]).emit('resetRound');
            playerWonTimer = 5;
        }
    },1000)
}
function voteTimer(){
    let voteTime = 5;
    console.log("votingtime");
    let votingInterval = setInterval(function(){
        voteTime--;
        io.emit('timer', voteTime);
        if(voteTime <= 0){
            clearInterval(votingInterval);
            if(p1Votes > p2Votes){
                io.emit('winner',["P1",p1Votes]);
            }else if(p1Votes < p2Votes){
            io.emit('winner',["P2",p2Votes]);
            }else if(p1Votes == p2Votes){
                io.emit('tie', p1Votes);
            }
            newRound();
        }
    },1000)
}
io.sockets.on('connection', (socket) =>{
    console.log('client connected with ' + socket.id);
    users.push(socket.id);
    socket.emit('join',(gameState));
    console.log(users);
    if(users.length >= 2 && gameStarted == false){
        ready = true;
        console.log("ready");
        io.emit('readyButton', ready);
    }
    socket.on("newRound",()=>{
        roundNum++;
        gameStarted = true;
        let timer = 5;
        let timerInterval = setInterval(function(){
            timer--;
            io.emit('timer', timer);
            if(timer <= 0){
                clearInterval(timerInterval);
                io.emit('voting');
                voteTimer();
            }
        },1000)
        io.emit('newRound', [prompts[Math.floor(Math.random() * prompts.length)], roundNum]);
        p1Votes = 0;
        p2Votes = 0;
        randNum = users[Math.floor(Math.random() * users.length)];
        if(users.length >= 2){
            io.to(randNum).emit('playerNumber', 1);
            player1 = randNum;
            randNum = users[Math.floor(Math.random() * users.length)];
            console.log(randNum + " is P1");
            while(randNum == player1){
                randNum = users[Math.floor(Math.random() * users.length)];
            } 
            if(randNum != player1){
                io.to(randNum).emit('playerNumber', 2);
                console.log(randNum + " is P2");
                console.log("work please");
            }
        }
    })
    socket.on('vote',(player)=>{
        if(player == 1){
            p1Votes++;
            console.log(p1Votes);
        }
        else if (player == 2){
            p2Votes++;
            console.log(p2Votes);
        }
        io.emit('vote',[p1Votes,p2Votes]);
        
    })
    socket.on("disconnect", ()=>{
        console.log(socket.id + " has disconnected");
        users.splice(users.indexOf(socket.id),1);
        console.log(users);
        if(users.length < 2 && gameStarted == false){
            ready = false;
            io.emit('readyButton', ready);
        }
    })


    socket.on('mouse', (data)=>{
        //console.log('recieved mouse' + data.x + " " + data.y);
        gameState.push(data);
        //broadcast gives it to all nodes except for the node that called it
        socket.broadcast.emit('mouse', data);
    })
    socket.on('clear', (num)=>{
        socket.broadcast.emit('clear', num);
    })
})
