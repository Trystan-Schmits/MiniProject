const canvas = document.getElementById("birdgame");
const ctx = canvas.getContext("2d");
const scroll = {
    x: 0,
};
const bird = {
    x: 0,
    y:0,
    yv: 0,
    img: new Image(),
    src: "/Group/images/Game/birdgame_bird.png",
};
const pipe = {
    x: 0,
    y: 0,
    img: new Image(),
    src: "/Group/images/Game/birdgame_pipe.png",
};
// Correct positions to canvas reletive
pipe.x += canvas.width;
pipe.y += canvas.height;
bird.x += canvas.width;
bird.y += canvas.height;
scroll.x += canvas.width;
function birdPos() {
    bird.yv += 1;
    bird.y += bird.yv;
};
bird.x -= 100;
function update() {
    birdPos();
    drawImage(bird.img,bird.x,bird.y);
    requestAnimationFrame(update);
};
update();
document.addEventListener("keydown", function(event) {
    // Check if the key pressed is the space key (key code 32 or key value " ")
    if (event.keyCode === 32 || event.key === " ") {
      // Your code to handle the space key press goes here
      bird.yv = -10;
    }
});