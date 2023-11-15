
function text(x,y,space,cutx,text) {
    var words = text.split(" ");
    var len = words.length;
    var textX = x;
    var textY = y;
    for (var letter = 0; letter < len; letter++) {
        ctx.fillText(words[letter], textX, textY);
        textX += space*words[letter].length;
        if (textX+(space+words[letter].length) > cutx) {
            textX = x;
            textY += 14;
        }
    }
};