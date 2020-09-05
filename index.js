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
let io = require("socket.io").listen(server);
io.sockets.on('connection', (socket) =>{
    console.log('client connected with ' + socket.id);
    socket.on("disconnect", ()=>{
        console.log( socket.id + " has disconnected");
    })
    socket.on('mouse', (data)=>{
        console.log('recieved mouse' + data.x + " " + data.y);
        //broadcast gives it to all nodes except for the node that called it
        socket.broadcast.emit('mouse', data);
    })
})
