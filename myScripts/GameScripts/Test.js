// Setup Canvas
var canvas = document.createElement("canvas");
canvas.width = 400;
canvas.height = 400;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");

// Ray
var rayx;
var rayy;
var rayz;
var rayax;
var rayay;

// Rendered Points
var pointx;
var pointy;
var pointz;

// Camera
var camx = -100;
var camy = 50;
var camz = -200;
var rotx = 45;
var roty = -10;

function point(x,y,z) {
    pointx = x;
    pointy = y;
    pointz = z;
};

function calc(x,y,z) {
    point(x-camx,y-camy,z-camz);
    point(pointx*Math.cos(rotx)-pointz*Math.sin(rotx),pointy,pointx*Math.sin(rotx)+pointz*Math.cos(rotx));
    point(pointx,pointy*Math.cos(roty)-pointz*Math.sin(roty),pointy*Math.sin(roty)+pointz*Math.cos(roty));
    point(pointx*(250/pointz),pointy*(250/pointz),pointz);
    
    return (pointx,pointy);
};

function pointTo(x,y,z) {
    rayax = Math.atan((x-pointx)/(z-pointz)) + ((z>pointz)*180);
    rayay = Math.atan((y-pointy)/(z-pointz)) + ((z>pointz)*180);
    return (rayax,rayay);
};

function circle(x,y,radius) {
    ctx.beginPath();
    ctx.arc(x,y,radius,0,2*Math.PI);
    ctx.fill();
};

var pointX = [];
var pointY = [];
var pointZ = [];
function addPoints(width,height) {
    ctx.fillStyle = "white";
    var x = -width/2 + camx;
    var y = -height/2 + camy;
    var z = camz + 200;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            pointX.push(x);
            pointY.push(y);
            pointZ.push(z);
            x += 40;
        }
        x = -width/2 + camx;
        y += 40;
    }
};

function visualRay(x,y,z) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    ctx.beginPath();
    calc(0,0,0);
    ctx.moveTo(pointx, pointy);
    calc(x,y,z);
    ctx.lineTo(pointx, point);
    ctx.stroke();
};

function drawRays() {
    var len = pointX.length;
    for (var i = 0; i < len; i++) {
        visualRay(pointX[i],pointY[i],pointZ[i]);
    }
};

// Setup
addPoints(15,10);

function update() {
    // All Code
    drawRays();

    // Repeat
    update();
};

// Run
update();