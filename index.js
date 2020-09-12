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

let prompts = ["cat","dog","parrot","elephant","giraffe"];
let users = [];
let randNum;
let player1;
let p1Votes = 0;
let p2Votes = 0;
let io = require("socket.io").listen(server);
io.sockets.on('connection', (socket) =>{
    console.log('client connected with ' + socket.id);
    users.push(socket.id);
    socket.emit('join',(gameState));
    console.log(users);
    socket.on("newRound",()=>{
        p1Votes = 0;
        p2Votes = 0;
        randNum = users[Math.floor(Math.random(0, users.length))];
        if(users.length >= 2){
            io.to(randNum).emit('playerNumber', 1);
            player1 = randNum;
            randNum = users[Math.round(Math.random(0, users.length))];
            while(randNum == player1){
                randNum = users[Math.floor(Math.random(0, users.length))];
            } 
            io.to(randNum).emit('playerNumber', 2);
        }
        let timer = 1;
        let timerInterval = setInterval(function(){
            timer--;
            io.emit('timer', timer);
            if(timer <= 0){
                clearInterval(timerInterval);
                io.emit('voting');
            }
        },1000)
        io.emit('newRound', prompts[Math.floor(Math.random(0,prompts.length))]);
    })
    socket.on('vote',(player)=>{
        if(player == 1){
            p1Votes++;
        }
        else if (player == 2){
            p2Votes++;
        }
        console.log(p2Votes);
        io.emit('vote',[p1Votes,p2Votes]);
    })
    socket.on("disconnect", ()=>{
        console.log(socket.id + " has disconnected");
        users.splice(users.indexOf(socket.id),1);
        console.log(users);
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
