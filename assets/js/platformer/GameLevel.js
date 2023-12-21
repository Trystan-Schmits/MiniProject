import GameEnv from './GameEnv.js';
import Background from './Background.js';
import Background2 from './Background2.js';
import Platform from './Platform.js';
import Player from './Player.js';
import Tube from './Tube.js';
import Goomba from './Goomba.js'
import Scaffold from './Scaffold.js';
import Player2 from './Player2.js';
import Squid from './Squid.js';
import Mushroom from './Mushroom.js';

// Store the assets and attributes of the Game at the specific GameLevel.
class GameLevel {
    constructor(gameObject) {
        // conditional assignments from GameObject to instance variables
        this.tag = gameObject?.tag;
        this.backgroundImg = gameObject.background?.file;
        this.background2Img = gameObject.background2?.file;
        this.platformImg = gameObject.platform?.file;
        this.playerImg = gameObject.player?.file;
        this.playerData = gameObject?.player;
        this.enemyImg = gameObject.enemy?.file;
        this.enemyData = gameObject?.enemy;
        this.tubeImg = gameObject.tube?.file;
        this.scaffoldImg = gameObject.scaffold?.file;
        this.Audio = gameObject.audio;
        this.powerImg =  gameObject.power?.file;
        this.powerData =  gameObject?.power;
        this.isComplete = gameObject?.callback; // function that determines if level is complete
        GameEnv.levels.push(this);
    }

    // Load level data
    async load() {
        
        // test for presence of Images
        const imagesToLoad = [];
        if (this.backgroundImg) {
            imagesToLoad.push(this.loadImage(this.backgroundImg));
        }
        if (this.background2Img) {
            imagesToLoad.push(this.loadImage(this.background2Img));
        }
        if (this.platformImg) {
            imagesToLoad.push(this.loadImage(this.platformImg));
        }
        if (this.playerImg) {
            imagesToLoad.push(this.loadImage(this.playerImg));
        }
        if (this.enemyImg) {
            imagesToLoad.push(this.loadImage(this.enemyImg));
        }
        if (this.powerImg) {
            imagesToLoad.push(this.loadImage(this.powerImg));
        }
        if (this.tubeImg) {
            imagesToLoad.push(this.loadImage(this.tubeImg));
        }
        if (this.scaffoldImg) {
            imagesToLoad.push(this.loadImage(this.scaffoldImg));
        }
        if (this.Audio) {
            const Audio = document.getElementById("audioElement");
            const AudioMp3 = document.getElementById("mp3Source");
            AudioMp3.src = this.Audio.file;
            Audio.load()
        }
        else{
            const Audio = document.getElementById("audioElement");
            const AudioMp3 = document.getElementById("mp3Source");
            AudioMp3.src = "";
        }

        try {
            // Do not proceed until images are loaded
            const loadedImages = await Promise.all(imagesToLoad);
            var i = 0;

            // Prepare HTML with Background Canvas (if backgroundImg is defined)
            if (this.backgroundImg) {
                const backgroundCanvas = document.createElement("canvas");
                backgroundCanvas.id = "background";
                document.querySelector("#canvasContainer").appendChild(backgroundCanvas);
                const backgroundSpeedRatio = 0;
                new Background(backgroundCanvas, loadedImages[i], backgroundSpeedRatio);
                i++;
            }

            // Prepare HTML with Background Canvas (if backgroundImg is defined)
            if (this.background2Img) {
                const backgroundCanvas = document.createElement("canvas");
                backgroundCanvas.id = "background2";
                document.querySelector("#canvasContainer").appendChild(backgroundCanvas);
                const backgroundSpeedRatio = 0;
                new Background2(backgroundCanvas, loadedImages[i], backgroundSpeedRatio);
                i++;
            }

            // Prepare HTML with Platform Canvas (if platformImg is defined)
            if (this.platformImg) {
                const platformCanvas = document.createElement("canvas");
                platformCanvas.id = "platform";
                document.querySelector("#canvasContainer").appendChild(platformCanvas);
                const platformSpeedRatio = 0;
                new Platform(platformCanvas, loadedImages[i], platformSpeedRatio);
                i++;
            }

            // Prepare HTML with Player Canvas (if playerImg is defined)
            if (this.playerImg) {
                const playerCanvas = document.createElement("canvas");
                playerCanvas.id = "character";
                document.querySelector("#canvasContainer").appendChild(playerCanvas);
                const playerSpeedRatio = 0.7;
                if (this.playerData.type == 0){
                    new Player(playerCanvas, loadedImages[i], playerSpeedRatio, this.playerData);
                }
                else{
                    new Player2(playerCanvas, loadedImages[i], playerSpeedRatio, this.playerData);
                }
                i++;
            }

            // Prepare HTML with Enenemy Canvas (if enemyImg is defined)
            if (this.enemyImg) {
                const enemyCanvas = document.createElement("canvas");
                document.querySelector("#canvasContainer").appendChild(enemyCanvas);
                const enemySpeedRatio = 0.7;
                if (this.enemyData.type == 0){
                    enemyCanvas.id = "enemy";
                    new Goomba(enemyCanvas, loadedImages[i], enemySpeedRatio, this.enemyData);
                }else{
                    enemyCanvas.id = "enemy2";
                    new Squid(enemyCanvas, loadedImages[i], enemySpeedRatio, this.enemyData);
                }
                i++;
            }

            // Prepare HTML with Enenemy Canvas (if enemyImg is defined)
            if (this.powerImg) {
                const powerCanvas = document.createElement("canvas");
                document.querySelector("#canvasContainer").appendChild(powerCanvas);
                const powerSpeedRatio = 0.7;
                if (this.powerData.type == 0){
                    powerCanvas.id = "power";
                    new Mushroom(powerCanvas, loadedImages[i], powerSpeedRatio, this.powerData);
                }
                i++;
            }

            // Prepare HTML with Player Canvas (if playerImg is defined)
            if (this.tubeImg) {
                const tubeCanvas = document.createElement("canvas");
                tubeCanvas.id = "tube";
                document.querySelector("#canvasContainer").appendChild(tubeCanvas);
                new Tube(tubeCanvas, loadedImages[i]);
                i++;
            }

            // Prepare HTML with Scaffold Canvas (if scaffoldImg is defined)
            if (this.scaffoldImg) {
                const scaffoldCanvas = document.createElement("canvas");
                scaffoldCanvas.id = "scaffold";
                document.querySelector("#canvasContainer").appendChild(scaffoldCanvas);
                new Scaffold(scaffoldCanvas, loadedImages[i]);
                i++;
            }


        } catch (error) {
            console.error('Failed to load one or more images:', error);
        }

    }

    // Create a function to load an image and return a Promise
    async loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = src;
            image.onload = () => resolve(image);
            image.onerror = reject;
        });
    }
}

export default GameLevel;