let socket;
function setup(){
    background(0);
    createCanvas(windowWidth, windowHeight);
    socket = io.connect("http://localhost:3000");
    socket.on('mouse', (data)=>{
        fill('blue');
        noStroke();
        ellipse(data.x,data.y,80,80);
    })
    
    socket.on('join',(gameState)=>{
        fill('blue');
        noStroke();
        for(let i=0; i<gameState.length; i++){
            ellipse(gameState[i].x,gameState[i].y,80,80);
        }
    });

    //just an event to toggle the turn on or off /
    //send the id of the socket whos turn it is to every user, then the client can figure out if its their turn
    //socket.on("toggleTurn",isMyturn) => {myTurn = isMyturn}
    //git branch nbame



}
function draw(){

}
function mouseDragged(){

    // if(IsMyTurn){
    //     //do the stuff
    // }

    let data = {
        x: mouseX,
        y: mouseY
    }
    fill('blue');
    noStroke();
    ellipse(data.x,data.y,80,80);
    socket.emit("mouse", data);
}