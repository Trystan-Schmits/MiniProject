class Movement{
    //up = "KeyW"; //default keybinds for controls
    right = "KeyD";
    left = "KeyA";
    jump = "Space";
    down = "ShiftLeft";

    directionX = 1;
    directionY = 0;
    instantY = 0;
    gravity = 80;
    speed = 100;
    moving = false;
    
    constructor(){
        this.position = {
            x:0,
            y:0
        };
    }
    onFrame(fps){
        this.position = {
            x: Math.round(this.position.x+this.moving*this.speed*this.directionX*(1/fps)),
            y: this.position.y + (this.instantY*(1/fps))
        }
        if(this.position.y<0){
            this.instantY = 0;
            this.directionY = 0;
            this.position.y = 0;
        }
        if(this.position.y>0){
            this.instantY-=this.gravity*(1/fps);
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
                break;
            case this.right:
                this.directionX = 1;
                this.moving = true;
                break;
            case this.left:
                this.directionX = -1;
                this.moving = true;
                break;
            case this.jump:
                if (this.position.y == 0){
                this.instantY = 80;
                this.directionY = 1;
                }
                break;
        }
    }
    handleKeyup(event){
        event.preventDefault();
        switch(event.code){
            case this.down:
                this.directionY = 0;
                break;
            case this.right:
                this.moving = false;
                break;
            case this.left:
                this.moving = false;
                break;
        }
    }
}

export default Movement;