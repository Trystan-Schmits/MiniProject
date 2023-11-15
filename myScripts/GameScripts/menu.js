const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

var mouseX;
var mouseY;
document.addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

function checkCollide(x, y, width, height) {
    var tx = mouseX - x;
    var ty = mouseY - y;
    if (Math.abs(tx) < width) {
        if (Math.abs(ty) < height) {
            return true;
        }
    }
};

function text(x, y, space, text) {
    var len = text.length;
    var textX = x;
    for (var letter = 0; letter < len; letter++) {
        ctx.fillText(text[letter], textX, y);
        textX += space;
    }
};

var buttonSpace = 30;

function drawButton(x, y, id) {
    if (checkCollide(x, y, buttonSpace * id.length, 14)) {
        buttonSpace += (40 - buttonSpace) / 8;
    } else {
        buttonSpace += (30 - buttonSpace) / 8;
    }
    text(x, y, buttonSpace, id); // Change buttonSpacing to buttonSpace
};

function update() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";

    drawButton(0, 0, "Hello World");

    requestAnimationFrame(update);
};

update();