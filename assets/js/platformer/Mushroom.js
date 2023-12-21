import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import Character from './Character.js';

class Mushroom extends Character{
    constructor(canvas, image, speedRatio, powerData){
        super(canvas, image, speedRatio, powerData.width, 
            powerData.height)

        this.x = GameEnv.innerWidth/4;
        this.scaledCharacterHeightRatio = (1/20);
        this.isMushroom = true;
    }

    update() {
        var direction = this.speed > 0;
        // Check if the enemy is at the left or right boundary
        if (this.x <= 0 && (direction == false||this.speed>=0))  {
            // Change direction by reversing the speed
            this.speed = -this.speed;
        }
        else if(this.x + this.canvasWidth >= GameEnv.innerWidth && (direction == true||this.speed<0)){
            this.speed = -this.speed;
        }

        //Initially get the enemy moving
        this.x += this.speed;

        //do something else
        super.update();
    }
}

export default Mushroom;
