var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");

var mouse = {
    x : undefined,
    y : undefined,
    radius: (canvas.width/100) * (canvas.height/100)
}

window.addEventListener("mousemove", function(e){
    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        mouse.x = touch.pageX;
        mouse.y = touch.pageY;
    } else if (e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover' || e.type=='mouseenter' || e.type=='mouseleave') {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
    
})

window.addEventListener("resize", function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouse.radius = (canvas.width/100) * (canvas.height/100);
    init();
})

window.addEventListener("mouseout", function(e){
    if(e.type == "mouseout") {
        mouse.x = undefined;
        mouse.y = undefined;
    }

    else if (e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        mouse.x = undefined;
        mouse.y = undefined;
    }
}
)


class ParticleBoi{
    constructor(x, y, dx, dy, size){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = "#27374D";
    }

    draw(){
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update(){
        // move particles in opposite direction if they touch the walls
        if (this.x > canvas.width || this.x < 0){
            this.dx = -this.dx;
        } 

        if (this.y > canvas.height || this.y < 0) {
            this.dy = -this.dy;
        }

        // collision detection with mouse
        let distance = Math.sqrt((this.x - mouse.x) * (this.x - mouse.x) + (this.y - mouse.y) * (this.y - mouse.y)) // pythagoras
        if (distance < mouse.radius + this.size){
            // collision happened
            // now we add interactivity with the mouse, particles are pushed on a direction depending on mouse position, only if they are not too close to the walls
            if (mouse.x < this.x && this.x < (canvas.width - this.size*10)) 
            {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size*10){
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < (canvas.height - this.size*10)) 
            {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size*10){
                this.y -= 10;
            }
        }
        // move them forward regardless
        this.x += this.dx;
        this.y += this.dy;

        // draw the particles
        this.draw();
    }
}

function connect(){
    let opacity = 1
    for (let a = 0; a < particlesArray.length; a++){
        for (let b = a; b < particlesArray.length; b++){
            let distance = (particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x) + 
                           (particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y);
            if (distance < (canvas.width/7) * (canvas.height/7)){
                opacity = 1 - (distance/20000);
                c.strokeStyle = `rgba(39, 55, 77, ${opacity})`;
                c.lineWidth = 1;
                c.beginPath();
                c.moveTo(particlesArray[a].x, particlesArray[a].y)
                c.lineTo(particlesArray[b].x, particlesArray[b].y)
                c.stroke();
            }               
        }
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numberOfParticles; i++){
        c.beginPath();
        particlesArray[i].update();
    }
    connect();
}

let particlesArray = [];

function init(){
    numberOfParticles = (canvas.width * canvas.height) / 9000;
    for (let i = 0; i < numberOfParticles; i++){
        let size = (Math.random() * 5) + 1;
        let dx = (Math.random() * 5) - 2.5;
        let dy = (Math.random() * 5) - 2.5;
        let x = (Math.random() * ((innerWidth - size*2) - size*2) + size*2);
        let y = (Math.random() * ((innerHeight - size*2) - size*2) + size*2);
        particlesArray.push(new ParticleBoi(x, y, dx, dy, size));
    }
}

init();
animate();

