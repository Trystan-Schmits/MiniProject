export default function light(source,lightObject,canvas,withScroll){
    var scale = lightObject.ReturnScale()
    for (let i=0;i<source.length;i++){
        source[i][0] -= scale[0]/2*source[i][2];
        source[i][1] += scale[1]/2*source[i][2];
    } //center positions to the middle of the light source
    var imageData;
    var newData;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,500,500);
    //ctx.globalCompositeOperation = "lighter"; //adds overlapping colors together
    for (let i=0;i<source.length;i++){
        if(withScroll == null || withScroll == false){lightObject.draw(ctx,source[i]);}else{lightObject.drawWithCameraScroll(ctx,source[i]);}      
    }
    imageData = ctx.getImageData(0,0,500,500);
    newData = imageData.data;
    for (let ii = 3; ii<newData.length; ii+=4){
        newData[ii]=255-newData[ii] //reverse alpha     
    }
    
    ctx.putImageData(imageData,0,0);
}
