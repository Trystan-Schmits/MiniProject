import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import Character from './Character.js';

class Goomba extends Character{
    constructor(canvas, image, speedRatio, enemyData){
        console.log(image);
        super(canvas, image, speedRatio, enemyData.width, 
            enemyData.height, )
    }

    update() {
        var direction = this.speed > 0;
        // Check if the enemy is at the left or right boundary
        if (this.x <= 0 && direction == false)  {
            // Change direction by reversing the speed
            this.speed = -this.speed;
        }
        else if(this.x + this.canvasWidth >= GameEnv.innerWidth && direction == true){
            console.log("fired", this.x, GameEnv.innerWidth, direction)
            this.speed = -this.speed;
        }

        //Initially get the enemy moving
        this.x += this.speed;

        //do something else
    }
}

export default Goomba;
