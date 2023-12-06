import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import Character from './Character.js';

class Goomba extends Character{
    constructor(canvas, image, speedRatio, enemyData){
        super(canvas, image, speedRatio, enemyData.width, 
            enemyData.height, )
    }

    update() {
        // Check if the enemy is at the left or right boundary
        if (this.x <= 0 || this.x + this.width >= GameEnv.innerWidth) {
            // Change direction by reversing the speed
            this.speed = -this.speed;
        }

        //Initially get the enemy moving
        this.x += this.speed;

        //do something else
    }
}

export default Goomba;