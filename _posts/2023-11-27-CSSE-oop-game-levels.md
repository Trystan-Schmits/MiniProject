---
layout: base
title: Dynamic Game Levels
description: Early steps in adding levels to an OOP Game.  This includes basic animations left-right-jump, multiple background, and simple callback to terminate each level.
type: ccc
courses: { csse: {week: 14}, csp: {week: 14}, csa: {week: 14} }
image: /images/platformer/backgrounds/hills.png
---

<style>
    #gameBegin, #controls, #gameOver, #settings {
      position: relative;
        z-index: 2; /*Ensure the controls are on top*/
    }
    .sidenav {
      position: fixed;
      height: 100%; /* 100% Full-height */
      width: 0px; /* 0 width - change this with JavaScript */
      z-index: 3; /* Stay on top */
      top: 0; /* Stay at the top */
      left: 0;
      overflow-x: hidden; /* Disable horizontal scroll */
      padding-top: 60px; /* Place content 60px from the top */
      transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
      background-color: black;
    }
</style>

<div id="mySidebar" class="sidenav">
  <a href="javascript:void(0)" id="toggleSettingsBar1" class="closebtn">&times;</a>
</div>

<!-- Prepare DOM elements -->
<!-- Wrap both the canvas and controls in a container div -->
<div id="canvasContainer">
    <div id="gameBegin" hidden>
        <button id="startGame">Start Game</button>
    </div>
    <div id="controls"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleCanvasEffect">Invert</button>
    </div>
    <div id="settings"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleSettingsBar">Settings</button>
    </div>
    <div id="gameOver" hidden>
        <button id="restartGame">Restart</button>
    </div>
</div>

<!-- regular game -->
<script type="module">
    // Imports
    import GameEnv from '{{site.baseurl}}/assets/js/platformer/GameEnv.js';
    import GameLevel from '{{site.baseurl}}/assets/js/platformer/GameLevel.js';
    import GameControl from '{{site.baseurl}}/assets/js/platformer/GameControl.js';


    /*  ==========================================
     *  ======= Data Definitions =================
     *  ==========================================
    */

    // Define assets for the game
    var assets = {
      obstacles: {
        tube: { src: "/images/platformer/obstacles/tube.png" },
      },
      platforms: {
        grass: { src: "/images/platformer/platforms/pigfarm.png"},
        alien: { src: "/images/platformer/platforms/alien.png" },
        carpet: { src: "/images/platformer/platforms/carpet.jpeg"},
        redCarpet: { src: "/images/Game/redPixel.png"}
      },
      backgrounds: {
        start: { src: "/images/platformer/backgrounds/Joke.jpg" },
        hills: { src: "/images/platformer/backgrounds/GD_Background.png" },
        planet: { src: "/images/platformer/backgrounds/Del_Norte.png" },
        castles: { src: "/images/platformer/backgrounds/castles.png" },
        end: { src: "/images/platformer/backgrounds/game_over.png" },
        theMove: { src: "/images/Game/room2.png" },
      },
      players: {
        mario: {
          type: 0,
          src: "/images/platformer/sprites/mario.png",
          width: 256,
          height: 256,
          w: { row: 10, frames: 15 },
          wa: { row: 11, frames: 15 },
          wd: { row: 10, frames: 15 },
          a: { row: 3, frames: 7, idleFrame: { column: 7, frames: 0 } },
          s: { row: null, frames: null},
          d: { row: 2, frames: 7, idleFrame: { column: 7, frames: 0 } }
        },
        monkey: {
          type: 0,
          src: "/images/platformer/sprites/monkey.png",
          width: 40,
          height: 40,
          w: { row: 9, frames: 15 },
          wa: { row: 9, frames: 15 },
          wd: { row: 9, frames: 15 },
          a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
          s: { row: 12, frames: 15 },
          d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
        },
        lopez: {
          type: 1,
          src: "/images/platformer/sprites/lopez.png", // Modify this to match your file path
          width: 46,
          height: 52,
          idle: { row: 6, frames: 3, idleFrame: {column: 1, frames: 0} },
          a: { row: 1, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Right Movement
          d: { row: 2, frames: 3, idleFrame: { column: 1, frames: 0 } }, // Left Movement 
          w: { row: 3, frames: 3}, // Up
          wa: { row: 3, frames: 3},
          wd: { row: 3, frames: 3},
          runningLeft: { row: 5, frames: 4, idleFrame: {column: 1, frames: 0} },
          runningRight: { row: 4, frames: 4, idleFrame: {column: 1, frames: 0} },
          s: {}, // Stop the movement 
        },
        jaden: {
          type: 0,
          src: "/images/Game/walking-sprite2.png",
          width: 44,
          height: 54,
          w: { row: 0, frames: 0 },
          wa: { row: 1, frames: 4 },
          wd: { row: 0, frames: 4 },
          a: { row: 1, frames: 4, idleFrame: { column: 3, frames: 0 } },
          s: { row: 0, frames: 0 },
          d: { row: 0, frames: 4, idleFrame: { column: 3, frames: 0 } }
        },
      },
      enemies: {
        goomba: {
          src: "/images/platformer/sprites/goomba.png",
          type: 0,
          width: 448,
          height: 452,
        },
        squid: {
          src: "/images/Game/squid.png",
          type: 1,
          width: 190,
          height: 175,
          animation: {row: 0, frames: 3},
        }
      },
      scaffolds: {
          brick: { src: "/images/platformer/obstacles/brick.png" }, //need to import image
      },
    };

    // add File to assets, ensure valid site.baseurl
    Object.keys(assets).forEach(category => {
      Object.keys(assets[category]).forEach(assetName => {
        assets[category][assetName]['file'] = "{{site.baseurl}}" + assets[category][assetName].src;
      });
    });

    /*  ==========================================
     *  ===== Game Level Call Backs ==============
     *  ==========================================
    */

    // Level completion tester
    function testerCallBack() {
        // console.log(GameEnv.player?.x)
        if (GameEnv.player?.x > GameEnv.innerWidth) {
            return true;
        } else {
            return false;
        }
    }

    // Helper function for button click
    function waitForButton(buttonName) {
      // resolve the button click
      return new Promise((resolve) => {
          const waitButton = document.getElementById(buttonName);
          const waitButtonListener = () => {
              resolve(true);
          };
          waitButton.addEventListener('click', waitButtonListener);
      });
    }

    // Start button callback
    async function startGameCallback() {
      const id = document.getElementById("gameBegin");
      id.hidden = false;
      
      // Use waitForRestart to wait for the restart button click
      await waitForButton('startGame');
      id.hidden = true;
      
      return true;
    }

    // Home screen exits on Game Begin button
    function homeScreenCallback() {
      // gameBegin hidden means game has started
      const id = document.getElementById("gameBegin");
      return id.hidden;
    }

    // Game Over callback
    async function gameOverCallBack() {
      const id = document.getElementById("gameOver");
      id.hidden = false;
      
      // Use waitForRestart to wait for the restart button click
      await waitForButton('restartGame');
      id.hidden = true;
      
      // Change currentLevel to start/restart value of null
      GameEnv.currentLevel = null;

      return true;
    }

    /*  ==========================================
     *  ========== Game Level setup ==============
     *  ==========================================
     * Start/Homme sequence
     * a.) the start level awaits for button selection
     * b.) the start level automatically cycles to home level
     * c.) the home advances to 1st game level when button selection is made
    */
    // Start/Home screens
    new GameLevel( {tag: "start", callback: startGameCallback } );
    new GameLevel( {tag: "home", background: assets.backgrounds.start, callback: homeScreenCallback } );
    // Game screens
    new GameLevel( {tag: "hills", background: assets.backgrounds.hills, platform: assets.platforms.grass, player: assets.players.mario, tube: assets.obstacles.tube, scaffold: assets.scaffolds.brick, callback: testerCallBack } );
    new GameLevel( {tag: "alien", background: assets.backgrounds.planet, platform: assets.platforms.alien, player: assets.players.monkey, enemy: assets.enemies.goomba, callback: testerCallBack } );
    new GameLevel( {tag: "lopez", background: assets.backgrounds.planet, platform: assets.platforms.alien, scaffold: assets.scaffolds.brick, player: assets.players.lopez, enemy: assets.enemies.goomba, callback: testerCallBack } );
     new GameLevel( {tag: "the move", background: assets.backgrounds.theMove, platform: assets.platforms.redCarpet, player: assets.players.jaden, enemy: assets.enemies.squid, callback: testerCallBack } );
    // Game Over screen
    new GameLevel( {tag: "end", background: assets.backgrounds.end, callback: gameOverCallBack } );

    /*  ==========================================
     *  ========== Game Control ==================
     *  ==========================================
    */

    // create listeners
    toggleCanvasEffect.addEventListener('click', GameEnv.toggleInvert);
    window.addEventListener('resize', GameEnv.resize);

    // start game
    GameControl.gameLoop();

</script>

<!-- settings -->
<script type="module">
  //sidebar
  var toggle = false;
  function toggleWidth(){
    toggle = !toggle;
    document.getElementById("mySidebar").style.width = toggle?"250px":"0px";
  }
  document.getElementById("toggleSettingsBar").addEventListener("click",toggleWidth);
  document.getElementById("toggleSettingsBar1").addEventListener("click",toggleWidth);

  // Generate table
  import Controller from '{{site.baseurl}}/assets/js/platformer/Controller.js';
  
  var myController = new Controller();
  myController.initialize();

  var table = myController.levelTable;
  document.getElementById("mySidebar").append(table);
  

  var div = myController.speedDiv;
  document.getElementById("mySidebar").append(div);


  var div2 = myController.gravityDiv;
  document.getElementById("mySidebar").append(div2);
    //for(let i=levels.length-1;i>-1;i-=1){
    //  var row = document.createElement("tr");
    //  var c1 = document.createElement("td");
    //  var c2 = document.createElement("td");
    //  c1.innerText = levels[i].tag;
    //  if(levels[i].playerData){ //if player exists
    //      var charImage = new Image();
    //      charImage.src = "{{site.baseurl}}/"+levels[i].playerData.src;
    //      //var array = levels[i].playerData.src.split("/");
    //      //c2.innerText = array[array.length-1];
    //      c2.append(charImage);
    //  }
    //  else{
    //    c2.innerText = "none";
    //  }
    //  row.append(c1);
    //  row.append(c2);
    //  placeAfterElement.insertAdjacentElement("afterend",row);
    //}
</script>
