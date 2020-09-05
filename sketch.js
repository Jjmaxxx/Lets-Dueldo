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
}
function draw(){

}
function mouseDragged(){
    let data = {
        x: mouseX,
        y: mouseY
    }
    fill('blue');
    noStroke();
    ellipse(data.x,data.y,80,80);
    socket.emit("mouse", data);
}