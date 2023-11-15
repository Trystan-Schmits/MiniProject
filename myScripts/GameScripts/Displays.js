class Display{
    
    constructor(canvas,displaysToDraw){

        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.activeDisplay = displaysToDraw;
    }

    setActiveDisplay(newDisplay){
        this.activeDisplay = newDisplay;
    }

    draw(type){   
        var ctx = this.canvas.getContext("2d"); //get Main Canvas Context
        ctx.clearRect(0,0,this.width,this.height); //clear Main Canvas
        if (this.activeDisplay.length !== undefined){ //if there is multiple displays
            this.activeDisplay.forEach(function(obj){ctx.drawImage(obj.canvas,0,0);});
        }
        else{ctx.drawImage(this.activeDisplay.canvas,0,0);} //draw subCanvas onto main canvas
    }
}

class subDisplay{
    constructor(canvas,objects){
        this.canvas = canvas;
        this.objects = objects;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    OverrideScroll(pos){
        this.objects.forEach(function(obj){obj.UpdateCameraScroll(pos)})
    }

    draw(type){//type 0 = without CameraScroll, 1 with CameraScroll
        var ctx = this.canvas.getContext("2d");
        ctx.clearRect(0,0,this.width,this.height);
        switch(type){
            case 0:
            this.objects.forEach(function(obj){obj.draw(ctx,[0,0])});
            break;
            case 1:
            this.objects.forEach(function(obj){obj.drawWithCameraScroll(ctx,[0,0])});
            break;
        }
    }
}

export {Display,subDisplay}