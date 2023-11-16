---
layout: base
title: Mario Player with Hills Background
description: Early step in adding Mario into OOP Game
type: ccc
courses: { csse: {week: 14} }
image: /images/mario/hills.png
images:
  background:
    src: /images/mario/hills.png
  mario:
    src: /images/mario_animation.png
---
<!-- Liquid code, run by Jekyll, used to define location of asset(s) -->
{% assign backgroundFile = site.baseurl | append: page.images.background.src %}
{% assign playerFile = site.baseurl | append: page.images.mario.src %}

<style>
    #controls {
        position: relative;
        z-index: 2; /*Ensure the controls are on top*/
    }
</style>

<!-- Prepare DOM elements -->
<!-- Wrap both the dog canvas and controls in a container div -->
<div id="canvasContainer">
    <div id="controls"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleCanvasEffect">Invert</button>
    </div>
</div>

<script type="module">
    import GameEnv from '{{site.baseurl}}/assets/js/mario/GameEnv.js';
    import GameObject from '{{site.baseurl}}/assets/js/mario/GameObject.js';
    import Background from '{{site.baseurl}}/assets/js/mario/Background.js';
    import { initPlayer } from '{{site.baseurl}}/assets/js/mario/Player.js';

    // Create a function to load an image and return a Promise
    async function loadImage(src) {
        return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = src;
        image.onload = () => resolve(image);
        image.onerror = reject;
        });
    }

    // Game loop
    function gameLoop() {
        GameEnv.update();
        requestAnimationFrame(gameLoop);  // cycle game, aka recursion
    }

    // Window resize
    window.addEventListener('resize', function () {
        GameEnv.resize();
    });

    // Toggle "canvas filter property" between alien and normal
    toggleCanvasEffect.addEventListener("click", function () {
        GameEnv.toggleInvert();
    });
  
    // Setup and store Game Objects
    async function setupGame() {
        try {
            // Open image files for Game Objects
            const [backgroundImg, playerImg] = await Promise.all([
                loadImage('{{backgroundFile}}'),
                loadImage('{{playerFile}}'),
            ]);

            // Setup Globals
            GameEnv.gameSpeed = 2;
            GameEnv.gravity = 3;

            // Prepare HTML with Background Canvas
            const backgroundCanvas = document.createElement("canvas");
            backgroundCanvas.id = "background";
            document.querySelector("#canvasContainer").appendChild(backgroundCanvas);
            // Background object
            const backgroundSpeedRatio = 0
            new Background(backgroundCanvas, backgroundImg, backgroundSpeedRatio);  // Background Class calls GameObject Array which stores the instance

            // Prepare HTML with Player Canvas
            const playerCanvas = document.createElement("canvas");
            playerCanvas.id = "characters";
            document.querySelector("#canvasContainer").appendChild(playerCanvas);
            // Player object
            const playerSpeedRatio = 0.7
            initPlayer(playerCanvas, playerImg, playerSpeedRatio);

        // Trap errors on failed image loads
        } catch (error) {
            console.error('Failed to load one or more images:', error);
        }
    }
  
    // Call and wait for Game Objects to be ready
    await setupGame();

    // Trigger a resize at start up
    window.dispatchEvent(new Event('resize'));
    toggleCanvasEffect.dispatchEvent(new Event('click'));

    // Start the game
    gameLoop();
</script>
<style>
    #canvas {
        margin: 0;
        border: 1px solid white;
    }
</style>
<canvas id="canvas"></canvas>
<script>
    // Create empty canvas
    let canvas = document.getElementById('canvas');
    let c = canvas.getContext('2d');
    // Set the canvas dimensions
    canvas.width = 900;
    canvas.height = 600;
    // Define gravity value
    let gravity = 1.5;
    // Define the Player class
    class Player {
        constructor() {
            // Initial position and velocity of the player
            this.position = {
                x: 100,
                y: 200
            };
            this.velocity = {
                x: 0,
                y: 0
            };
            // Dimensions of the player
            this.width = 30;
            this.height = 30;
        }
        // Method to draw the player on the canvas
        draw() {
            c.fillStyle = 'red';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        // Method to update the players position and velocity
        update() {
            this.draw();
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
            // Apply gravity if player is not at the bottom
            if (this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y += gravity;
            else
                this.velocity.y = 0;
        }
    }
    //--
    // NEW CODE - PLATFORM
    //--
    // Define the Platform class
    class Platform {
        constructor(image) {
            // Initial position of the platform
            this.position = {
                x: 0,
                y: 300
            }
            this.image = image;
            this.width = 900;
            this.height = 100;
        }
        // Method to draw the platform on the canvas
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }
    class Goomba {
        constructor(image) {
            this.position = {
                x: 250,
                y: 245
            };
            this.image = image;
            this.width = 55;
            this.height = 55;
            this.velocity = {
                x: -2,
                y: 0
            }
        }
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        update() {
            this.position.x += this.velocity.x;
            this.draw();
            if (this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y += gravity;
            else
                this.velocity.y = 0;
        }
    }
    //--
    // NEW CODE - CREATE PLATFORM OBJECT WITH IMAGE
    //--
    // Load platform image
    let image = new Image();
    image.src = 'https://samayass.github.io/samayaCSA/images/platform.png'
    // Create a platform object
    let platform = new Platform(image);
    // Create a player object
    player = new Player();
    // Define keyboard keys and their states
    let imageGoomba = new Image()
    imageGoomba.src = 'https://samayass.github.io/samayaCSA/images/goomba.png';
    let goomba = new Goomba(imageGoomba)
    let keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }
    // Animation function to continuously update and render the canvas
    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);
        //--
        // NEW CODE - DRAW PLATFORM
        //--
        goomba.update();
        platform.draw();
        player.update();
        // Control players horizontal movement
        if (keys.right.pressed && player.position.x + player.width <= canvas.width - 50) {
            player.velocity.x = 15;
        } else if (keys.left.pressed && player.position.x >= 50) {
            player.velocity.x = -15;
        } else {
            player.velocity.x = 0;
        }
        //--
        // NEW CODE  - PLATFORM COLLISIONS
        //--
        // Check for collision between player and platform
        if (
            player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width
        ) {
            player.velocity.y = 0;
        }
        if(
            player.position.y + player.height <= goomba.position.y &&
            player.position.y + player.height + player.velocity.y >= goomba.position.y &&
            player.position.x + player.width >= goomba.position.x &&
            player.position.x <= goomba.position.x + goomba.width
        )
        {
            player.velocity.y = -20;
        }
        if (
            goomba.position.x >= platform.position.x &&
            goomba.position.x <= platform.position.x
        )
        {
            goomba.velocity.x = 2;
        }
    }
    // Start the animation loop
    animate();
    // Event listener for keydown events
    addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
            case 65:
                console.log('left');
                keys.left.pressed = true;
                break;
            case 83:
                console.log('down');
                break;
            case 68:
                console.log('right');
                keys.right.pressed = true;
                break;
            case 87:
                console.log('up');
                player.velocity.y -= 20;
                break;
        }
    });
    // Event listener for keyup events
    addEventListener('keyup', ({ keyCode }) => {
        switch (keyCode) {
            case 65:
                console.log('left');
                keys.left.pressed = false;
                break;
            case 83:
                console.log('down');
                break;
            case 68:
                console.log('right');
                keys.right.pressed = false;
                break;
            case 87:
                console.log('up');
                player.velocity.y = -20;
                break;
        }
    })
</script>