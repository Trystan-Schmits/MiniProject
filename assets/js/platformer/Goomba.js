import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import Character from './Character.js';

class Goomba extends Character{
    constructor(canvas, image, speedRatio, enemyData){
        super(canvas, image, speedRatio, enemyData.width, 
            enemyData.height)

        this.x = GameEnv.innerWidth/2;
        this.scaledCharacterHeightRatio = (1/20);
        this.isGoomba = true;
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

export default Goomba;
