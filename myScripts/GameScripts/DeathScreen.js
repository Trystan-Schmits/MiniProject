const canvas = document.getElelementById("deathScreen");
const ctx = canvas.getContext("2d");

// Create Letter Object
const letter = {
    x: 0,
    y: 0,
};

// Define Look Up List
const sources = ["/Group/images/Game/deathScreen/1Y.png","/Group/images/Game/deathScreen/2O.png","/Group/images/Game/deathScreen/3U.png","/Group/images/Game/deathScreen/4D.png","/Group/images/Game/deathScreen/5I.png","/Group/images/Game/deathScreen/6E.png","/Group/images/Game/deathScreen/7D.png"];

// Clone Letter
function slideY(y,newY) {
    return (y-newY)/12;
};

y1 = new Image();
y1.src = sources[0];
o2 = new Image();
o2.src = sources[1];
u3 = new Image();
u3.src = sources[2];
d4 = new Image();
d4.src = sources[3];
i5 = new Image();
i5.src = sources[4];
e6 = new Image();
e6.src = sources[5];
d7 = new Image();
d7.src = sources[6];

function update() {
    ctx.drawImage(o2,250,slideY(-250,250));
    requestAnimationFrame(update);
};

update();