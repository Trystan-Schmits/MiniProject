import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js'

export class Player2 extends Character{ //for lopez code
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, playerData,speedLimit){
        super(canvas, 
            image, 
            speedRatio,
            playerData.width, 
            playerData.height, 
        );
        
        // Player Data is required for Animations
        this.playerData = playerData;

        this.speedLimit = speedLimit;
        this.currentSpeed = 0;
        this.acceleration = 0.11; // Adjust based on preference
        this.deceleration = 0.1; // Adjust based on preference 
        this.count = 0;

        // Player control data
        this.pressedKeys = {};
        this.movement = {left: true, right: true, down: true};
        this.isIdle = true;
        this.stashKey = "d"; // initial key

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

        GameEnv.player = this;
    }

    setAnimation(key) {
        // animation comes from playerData
        var animation = this.playerData[key]
        // direction setup
        if (key === "a") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wa;
        } else if (key === "d") {
            this.stashKey = key;
            this.playerData.w = this.playerData.wd;
        }
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMaxFrame(animation.frames);
        if (this.isIdle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }i
    
    // check for matching animation
    isAnimation(key) {
        var result = false;
        if (key in this.pressedKeys) {
            result = !this.isIdle;
        }
        
        return result;
    }

    // check for gravity based animation
    isGravityAnimation(key) {
        var result = false;
    
        // verify key is in active animations
        if (key in this.pressedKeys ) {
            result = (!this.isIdle && this.bottom <= this.y)||!this.gravityEnabled;
        }

        // scene for on top of tube animation
        if (!this.movement.down) {
            this.gravityEnabled = false;
            // Pause for two seconds
            setTimeout(() => {   // animation in tube
                // This code will be executed after the two-second delay
                this.movement.down = true;
                this.gravityEnabled = true;
                setTimeout(() => { // move to end of game detection
                    this.x = GameEnv.innerWidth + 1;
                }, 1000);
            }, 2000);
        }
    
        // make sure jump has ssome velocity
        if (result) {
            // Adjust horizontal position during the jump
            const horizontalJumpFactor = 0.1; // Adjust this factor as needed
            this.x += this.speed * horizontalJumpFactor;  
        }
    
        // return to directional animation (direction?)
        if (this.bottom <= this.y) {
            this.setAnimation(this.stashKey);
        }

        return result;
    }
    

    // Player updates
    update() {
        if (this.isAnimation("a") &&this.y <=this.bottom) {
            console.log(this.speed)
            if (this.movement.left) this.x -= this.speed/2;
            GameEnv.backgroundSpeed = this.currentSpeed-this.speed/2;
        }
        else if (this.isAnimation("d") &&this.y <=this.bottom) {
            if (this.movement.right) this.x += this.speed/2;
            GameEnv.backgroundSpeed = this.currentSpeed+this.speed/2;
        }
        else{
            GameEnv.backgroundSpeed = this.currentSpeed;
        }
        if (this.isGravityAnimation("w")) {
            if (this.movement.down) this.y -= (this.bottom * .4);  // jump 11% higher than bottom
        } 

        if (this.pressedKeys['a'] && this.currentSpeed <= 0 && this.y >= this.bottom) {
            this.currentSpeed -= this.acceleration;
        } else if (this.pressedKeys['d'] && this.currentSpeed >= 0 && this.y >= this.bottom) {
            this.currentSpeed += this.acceleration;
        } else if (this.pressedKeys['a'] && this.currentSpeed > 0){
            // Decelerate faster when going opposite direction
            this.currentSpeed -= this.acceleration*2;
        } else if (this.pressedKeys['d'] && this.currentSpeed < 0){
            // Decelerate faster when going opposite direction
            this.currentSpeed += this.acceleration*2;
        } else if (this.y >= this.bottom){
            // Decelerate when no movement keys are pressed
            this.currentSpeed *= (1 - this.deceleration);
        }

        // Apply speed limit
        if (Math.abs(this.currentSpeed) > this.speedLimit) {
            this.currentSpeed = this.currentSpeed > 0 ? this.speedLimit : -this.speedLimit;
        }

        this.x += this.currentSpeed;

        // Check for speed threshold to change sprite sheet rows
        const walkingSpeedThreshold = 1; // Walking speed threshold
        const runningSpeedThreshold = 5; // Running speed threshold

        if (Math.abs(this.currentSpeed) >= runningSpeedThreshold) {
            this.count = 0;
            // Change sprite sheet row for running
            if (this.currentSpeed > 0) {
            this.setFrameY(this.playerData.runningRight.row);
            } else {
                this.setFrameY(this.playerData.runningLeft.row);
            }
        } else if (Math.abs(this.currentSpeed) >= walkingSpeedThreshold) {
            this.count = 0;
            // Change sprite sheet row for walking
            if (this.currentSpeed > 0) {
                this.setFrameY(this.playerData.d.row);
            } else {
                this.setFrameY(this.playerData.a.row);
            }
        } else if (this.currentSpeed < walkingSpeedThreshold && this.y >= this.bottom){
            this.count += 1;
        // Revert to normal animation if speed is below the walking threshold
            if (this.count >= GameEnv.frameRate*2){ //if 2 seconds have passed
            this.setFrameY(this.playerData.idle.row);
            }
        }

        // Perform super update actions
        super.update();
    }

    // Player action on collisions
    collisionAction() {
        if (this.collisionData.touchPoints.other.id === "tube") {
            // Collision with the left side of the Tube
            if (this.collisionData.touchPoints.other.left) {
                this.movement.right = false;
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.other.right) {
                this.movement.left = false;
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.other.ontop) {
                this.movement.down = false;
                this.x = this.collisionData.touchPoints.other.x;
            }
        } else {
            // Reset movement flags if not colliding with a tube
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
        }
        if (this.collisionData.touchPoints.other.id === "scaffold") {
            // Collision with the left side of the Platform
            if (this.collisionData.touchPoints.other.left && (this.topOfPlatform === true)) {
                this.movement.right = false;
            }
            // Collision with the right side of the platform
            if (this.collisionData.touchPoints.other.right && (this.topOfPlatform === true)) {
                this.movement.left = false;
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.this.ontop) {
                this.gravityEnabled = false;
                this.topOfPlatform = true; 
            }
            if (this.collisionData.touchPoints.this.top) {
                this.gravityEnabled = false;
            }
            //if (this.collisionData.touchPoints.this.top) {
            //    this.gravityEnabled = false;
            //    
            //    console.log(this.topOfPlatform + "top")
            //    console.log(this.gravityEnabled + "grav")
            //    //console.log("e");
            //}
        }else{
            this.topOfPlatform = false;
            this.movement.left = true;
            this.movement.right = true;
            this.movement.down = true;
            this.gravityEnabled = true;
            
        }

        if (this.collisionData.touchPoints.other.id === "enemy") {
            if (this.y >= this.bottom){ //you died
                //reload current level (death)
                GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
            }
            else{//you kill goomba
                this.y -= this.bottom*.2;//bounce
                for(let i = 0; i<GameEnv.gameObjects.length;i++){//loop through current gameObjects
                    if(GameEnv.gameObjects[i].isGoomba){ //look for object with (isGoomba==true) tag
                        var goomba = GameEnv.gameObjects[i].canvas; 

                        //remove goomba object
                        GameEnv.gameObjects.splice(i,1);

                        //animation
                        goomba.style["transform-origin"] = "bottom left";
                        goomba.style.transition = "all .3s ease-out";
                        goomba.style.transform = "scaleY(10%)";
                        setTimeout(()=>{
                             goomba.remove(); //remove goomba sprite from current level
                        },600)
                    }
                }
            }
        }

        if (this.collisionData.touchPoints.other.id === "power") {
            this.scaledCharacterHeightRatio = 2/10;
            this.size();
            for(let i = 0; i<GameEnv.gameObjects.length;i++){//loop through current gameObjects
                if(GameEnv.gameObjects[i].isMushroom){ //look for object with (isGoomba==true) tag
                    //get goomba canvas
                    GameEnv.gameObjects[i].canvas.remove();
                    GameEnv.gameObjects.splice(i,1);
                }
            }
        }
    }
    
    // Event listener key down
    handleKeyDown(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.isIdle = false;
            }
        }
    }

    // Event listener key up
    handleKeyUp(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            this.setAnimation(key);  
            // player idle
            this.isIdle = true;  
            GameEnv.backgroundSpeed = 0;     
        }
    }

    // Override destroy() method from GameObject to remove event listeners
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }
}


export default Player2;