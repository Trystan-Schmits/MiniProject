const http = require('http').createServer();

const io = require('socket.io')(http,{cors: {origin: "*"}});

const { v4: uuidv4 } = require('uuid');

io.on('connection',(socket) => {
    const id = uuidv4();
    socket.emit("id",id);
    
    console.log("a user connected, given id :"+id);

    socket.on('message',(message)=>{
        io.emit('message',message);
    })

    socket.on("update", (data) => {
        io.emit("stateUpdate", data);
    })
    
    socket.on("disconnect", () => {
        console.log("a user disconnected, with id:"+id)
        io.emit("disconnection", id);
    })
});

http.listen(8080, '0.0.0.0', ()=> console.log('listening to Port 8080'))

