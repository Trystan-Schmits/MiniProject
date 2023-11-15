class CreateObject{
    constructor(Name,SpriteSheet,SpriteScale,DrawScale,position,maxFrames,states,cameraScroll){
        this.name = Name;
        this.image = SpriteSheet;
        this.SpriteSize = SpriteScale; //size of each sprite
        this.scale = DrawScale; // size of drawn image
        this.position = position; //[x,y]
        this.frame = 0;
        this.state = 0;
        this.maxFrames = maxFrames;
        this.maxState = states;
        this.cameraScroll = cameraScroll;
        console.log(this)
    }

    ReturnPosition(){
        return this.position;
    }

    ReturnScale(){
        return this.scale;
    }

    OverridePosition(pos){
        this.position = pos;
    }

    UpdateFrame(newFrame){
        if (newFrame == null){newFrame = this.frame+1}
        this.frame = newFrame%this.maxFrames;
    }

    UpdateState(newState){
        if (newState == null){newState = this.state+1}
        this.state = newState%this.maxState;
    }

    UpdateCameraScroll(newScroll){
        this.cameraScroll = newScroll;
    }

    draw(ctx,scroll,rotation,reScale){
        ctx.imageSmoothingEnabled = false;
        if (rotation == null){rotation = 0};
        if (reScale == null){ if(scroll[2]==null){reScale = 1}else{reScale=scroll[2]}};
        var s1 = this.state;
        var x = this.position[0]+scroll[0];
        var y = this.position[1]+scroll[1];
        var a = (rotation * Math.PI)/180; //convert to rad
        
        //rotate object
        ctx.translate(x,y);
        ctx.rotate(a);

        //draw
        ctx.drawImage(this.image,this.frame*this.SpriteSize[0],s1*this.SpriteSize[1],this.SpriteSize[0],this.SpriteSize[1],0,0,this.scale[0]*reScale,-1*this.scale[1]*reScale);

        //undo rotations for next objects
        ctx.rotate(-a);
        ctx.translate(-x,-y);

    }

    drawWithCameraScroll(ctx,scroll,rotation,reScale){
        if (this.cameraScroll == null){throw new TypeError("there is no camera scroll"); return;}

        ctx.translate(this.cameraScroll[0],this.cameraScroll[1]);//scroll camera

        ctx.imageSmoothingEnabled = false;
        if (rotation == null){rotation = 0};
        if (reScale == null){ if(scroll[2]==null){reScale = 1}else{reScale=scroll[2]}};
        var s1 = this.state;
        var x = this.position[0]+scroll[0];
        var y = this.position[1]+scroll[1];
        var a = (rotation * Math.PI)/180; //convert to rad
        
        //rotate object
        ctx.translate(x,y);
        ctx.rotate(a);

        //draw
        ctx.drawImage(this.image,this.frame*this.SpriteSize[0],s1*this.SpriteSize[1],this.SpriteSize[0],this.SpriteSize[1],0,0,this.scale[0]*reScale,-1*this.scale[1]*reScale);
        
        //undo transformations for next objects
        ctx.rotate(-a);
        ctx.translate(-x,-y);
        ctx.translate(-this.cameraScroll[0],-this.cameraScroll[1]);
    }
}
export default CreateObject;