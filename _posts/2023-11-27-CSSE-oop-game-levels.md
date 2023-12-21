---
layout: base
title: Dynamic Game Levels
description: Early steps in adding levels to an OOP Game.  This includes basic animations left-right-jump, multiple background, and simple callback to terminate each level.
type: ccc
courses: { csse: {week: 14}, csp: {week: 14}, csa: {week: 14} }
image: /images/platformer/backgrounds/hills.png
---

<style>
    #gameBegin, #controls, #gameOver, #settings, #leaderboard {
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

    .timer{
      position: fixed;
      height: 10%; /* 100% Full-height */
      width: 20%; /* 0 width - change this with JavaScript */
      z-index: 3; /* Stay on top */
      top: 10%; /* Stay at the top */
      left: 70%;
      background-color: white;
      color: black;
    }
    canvas {
    animation: fadeInAnimation ease-in 1s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    }
 
    @keyframes fadeInAnimation {
      0% {
          /*translate: -100% 0;
          rotate: -180deg;
          */
          clip-path: circle(0%);
      }
      100% {
          /*translate: 0 0;
          rotate: 0deg;
          */
          clip-path: circle(100%);
      }
    }
</style>

<div id="mySidebar" class="sidenav">
  <a href="javascript:void(0)" id="toggleSettingsBar1" class="closebtn">&times;</a>
</div>

<div id="score" class="timer">
    Time: <span id="timeScore">[start timer]</span>
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
    <div id="leaderboard"> <!-- Controls -->
        <!-- Background controls -->
        <button id="leaderboardButton">Leaderboard</button>
    </div>
    <div id="gameOver" hidden>
        <button id="restartGame">Restart</button>
    </div>
    <audio id="audioElement" loop hidden>
      <source id="mp3Source">
    </audio>
</div>

<!-- regular game -->
<script type="module">
    // Imports
    import GameEnv from '{{site.baseurl}}/assets/js/platformer/GameEnv.js';
    import GameLevel from '{{site.baseurl}}/assets/js/platformer/GameLevel.js';
    import GameControl from '{{site.baseurl}}/assets/js/platformer/GameControl.js';
    import Leaderboard from '{{site.baseurl}}/assets/js/platformer/Leaderboard.js';


    /*  ==========================================
     *  ======= Data Definitions =================
     *  ==========================================
    */

    var leaderboardObject = new Leaderboard();
    leaderboardObject.initialize();

    // Define assets for the game
    var assets = {
      obstacles: {
        tube: { src: "/images/platformer/obstacles/tube.png" },
      },
      platforms: {
        grass: { src: "/images/platformer/platforms/grass.png"},
        pigfarm: { src: "/images/platformer/platforms/pigfarm.png"},
        alien: { src: "/images/platformer/platforms/alien.png" },
        carpet: { src: "/images/platformer/platforms/carpet.jpeg"},
        redCarpet: { src: "/images/platformer/platforms/redPixel.png"}
      },
      backgrounds: {
        start: { src: "/images/platformer/backgrounds/home.png" },
        joke: { src: "/images/platformer/backgrounds/Joke.jpg" },
        hills: { src: "/images/platformer/backgrounds/hills.png" },
        geometry: { src: "/images/platformer/backgrounds/GD_Background.png" },
        planet: { src: "/images/platformer/backgrounds/planet.jpg" },
        greenPlanet: { src: "/images/platformer/backgrounds/greenPlanet.jpg" },
        school: { src: "/images/platformer/backgrounds/Del_Norte.png" }, 
        castles: { src: "/images/platformer/backgrounds/castles.png" },
        clouds: { src: "/images/platformer/backgrounds/clouds.png" },
        end: { src: "/images/platformer/backgrounds/game_over.png" },
        theMove: { src: "/images/platformer/backgrounds/hallway.png" },
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
          src: "/images/platformer/sprites/jaden.png",
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
          src: "/images/platformer/sprites/squid.png",
          type: 1,
          width: 190,
          height: 175,
          animation: {row: 0, frames: 3},
        },
      },
      scaffolds: {
          brick: { src: "/images/platformer/obstacles/brick.png" }, //need to import image
          grass: { src: "/images/platformer/obstacles/grassScaffold.png" }, //need to import image
      },
      audio: {
          pink: { src: "/audio/platformer/pink.mp3" },
          space: { src: "/audio/platformer/space.mp3" },
          honor: { src: "/audio/platformer/honor.mp3" }
      },
      powers: {
        mushroom: {// fake enemy
          src: "/images/platformer/sprites/mushroom.png",
          type: 0,
          width: 4000,
          height: 4000,
        }
      }
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

      leaderboardObject.startTimer.bind(leaderboardObject)();

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

      leaderboardObject.stopTimer();
      
      // Check if the game over screen has been shown before
      if (!leaderboardObject["gameOverScreenShown"]) {
        const playerScore = document.getElementById("timeScore").innerHTML;
        const playerName = prompt(`You scored ${playerScore}! What is your name?`);
        let temp = leaderboardObject["leaderboard"];
        temp += playerName + "," + playerScore.toString() + ";";
        leaderboardObject["leaderboard"] = temp;
        // Set a flag in local storage to indicate that the game over screen has been shown
        leaderboardObject["gameOverScreenShown"] = true;

        leaderboardObject.saveAll();
      }

      // Use waitForRestart to wait for the restart button click
      await waitForButton('restartGame');
      id.hidden = true;
      
      // Change currentLevel to start/restart value of null
      GameEnv.currentLevel = null;

      leaderboardObject["gameOverScreenShown"] = false;
      leaderboardObject.saveAll();
      leaderboardObject.resetTimer();

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

    //geometry dash background with mario character
    new GameLevel( {tag: "geometry", background: assets.backgrounds.geometry, platform: assets.platforms.grass, player: assets.players.mario, tube: assets.obstacles.tube, scaffold: assets.scaffolds.brick, power: assets.powers.mushroom, callback: testerCallBack } );
    //monkey in an alien world
    new GameLevel( {tag: "alien", background: assets.backgrounds.planet, platform: assets.platforms.alien, player: assets.players.monkey, enemy: assets.enemies.goomba, callback: testerCallBack } );
    //mr lopez in a classic mario level
    new GameLevel( {tag: "lopez", background: assets.backgrounds.clouds, background2: assets.backgrounds.hills, platform: assets.platforms.grass, scaffold: assets.scaffolds.grass, player: assets.players.lopez, enemy: assets.enemies.goomba, audio: assets.audio.honor, power:assets.powers.mushroom, callback: testerCallBack } );
    //level based on Trystan's game from last tri.
     new GameLevel( {tag: "the move", background: assets.backgrounds.theMove, platform: assets.platforms.redCarpet, player: assets.players.jaden, enemy: assets.enemies.squid, audio: assets.audio.pink, callback: testerCallBack } );
    //level with greenPlanet background
     //new GameLevel( {tag: "green planet", background: assets.backgrounds.greenPlanet, platform: assets.platforms.grass, player: assets.players.monkey, enemy: assets.enemies.squid, audio: assets.audio.space, callback: testerCallBack } );
    // Game Over screen
    new GameLevel( {tag: "end", background: assets.backgrounds.end, callback: gameOverCallBack } );

    /*  ==========================================
     *  ========== Game Control ==================
     *  ==========================================
    */

    // create listeners
    toggleCanvasEffect.addEventListener('click', GameEnv.toggleInvert);
    window.addEventListener('resize', GameEnv.resize);
    // Event listener for the start game button click
    document.getElementById('leaderboardButton').addEventListener('click', leaderboardObject.showLeaderboard.bind(leaderboardObject));

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
