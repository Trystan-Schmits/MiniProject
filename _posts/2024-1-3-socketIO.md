---
layout: post
title: SocketIO
description: SocketIO testing
courses: { csse: {week: 20} }
type: devops
---
<body>
<button id="clickMe">hello</button>
<script src="https://cdn.socket.io/socket.io-3.0.0.js"></script>
<script>
    const socket = io("ws://localhost:8080");
    var id;
    socket.on("message",text =>{
        console.log(text);
    });
    socket.on("id",text =>{
        if(id==undefined){
            id=text;
        }
    });
    document.getElementById("clickMe").addEventListener("click",()=>{
        socket.emit("message",[id,"hello"]);
    });
</script>
</body>