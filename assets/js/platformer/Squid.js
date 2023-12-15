import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import Character from './Character.js';

class Squid extends Character{
    constructor(canvas, image, speedRatio, enemyData){
        super(canvas, image, speedRatio, enemyData.width, 
            enemyData.height)
        
        this.enemyData = enemyData;
        this.x = GameEnv.innerWidth/2;
        this.scaledCharacterHeightRatio = (1/10);
        this.isGoomba = true;
        this.count = 0;
        this.maxFrame = enemyData.animation.frames;
        this.frameY = enemyData.animation.row;
    }

    update() {
        super.update();

        var direction = this.speed > 0;
        // Check if the enemy is at the left or right boundary
        if (this.x <= 0 && (direction == false||this.speed>=0))  {
            // Change direction by reversing the speed
            this.speed = -this.speed;
        }
        else if(this.x + this.canvasWidth >= GameEnv.innerWidth && (direction == true||this.speed<0)){
            this.speed = -this.speed;
        }

        if (GameEnv.player){ // turn toward player
            if(GameEnv.player.x >= this.x  && (direction == false||this.speed<=0)){
                this.count += 1;
                if (this.count >= GameEnv.frameRate){
                    this.speed = -this.speed;
                }
            } else if(GameEnv.player.x <= this.x && (direction == true||this.speed>0)){
                this.count += 1;
                if (this.count >= GameEnv.frameRate){
                    this.speed = -this.speed;
                }
            }
            else{
                this.count = 0;
            }
        }
        //Initially get the enemy moving
        this.x += this.speed;

        var animation = this.enemyData.animation;
        //do something else
    }
}

export default Squid;
