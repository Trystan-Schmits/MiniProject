class Movement{
    //up = "KeyW"; //default keybinds for controls
    right = "KeyD";
    left = "KeyA";
    up = "KeyW";
    down = "KeyS";

    directionX = 1;
    directionY = 0;
    speed = 100;
    movingX = false;
    movingY = false;
    
    constructor(){
        this.position = {
            x:0,
            y:0
        };
    }
    onFrame(fps){
        this.position = {
            x: Math.round(this.position.x+this.movingX*this.speed*this.directionX*(1/fps)),
            y: Math.round(this.position.y+this.movingY*this.speed*this.directionY*(1/fps))
        }
        return this.position;
    }
    getPosition(){
        return this.position;
    }
    handleKeydown(event){
        event.preventDefault();
        switch(event.code){
            case this.down:
                this.directionY = -1;
                this.movingY = true
                break;
            case this.right:
                this.directionX = 1;
                this.movingX = true;
                break;
            case this.left:
                this.directionX = -1;
                this.movingX = true;
                break;
            case this.up:
                this.directionY = 1;
                this.movingY = true
                break;
        }
    }
    handleKeyup(event){
        event.preventDefault();
        switch(event.code){
            case this.down:
                this.movingY = false;
                break;
            case this.right:
                this.movingX = false;
                break;
            case this.left:
                this.movingX = false;
                break;
            case this.up:
                this.movingY = false;
                break;
        }
    }
}

export default Movement;