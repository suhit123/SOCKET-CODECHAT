const server = require('http').createServer();
const io = require('socket.io')(server,{
    cors:true
});
let onLineUsers=[]
io.on('connection', socket => {
    socket.on('newUserAdd',(userId)=>{
        !onLineUsers.some((user)=>user.userId===userId) &&
        onLineUsers.push({userId,socketId:socket.id})
        io.emit('getOnlineUsers',onLineUsers);
    })
    socket.on('disconnect',()=>{
        console.log('Disconnected')
        onLineUsers=onLineUsers.filter((item)=>item.socketId!==socket.id);
        io.emit('getOnlineUsers',onLineUsers);
    })
    socket.on("sendMessage",(message)=>{
        const user=onLineUsers.find((user)=>user.userId===message.recipientId)
        // console.log(message,user,onLineUsers)
        if(user){
            io.to(user.socketId).emit("getMessage",message)
        }
    })
    socket.on("sendUserAdded",(newUserChat)=>{
        const secondUserId=newUserChat.secondId;
        const user=onLineUsers.find((user)=>user.userId===secondUserId)
        console.log(newUserChat,user)
        if(user){
            io.to(user.socketId).emit("getUserAdded",newUserChat)
        }
    })
    socket.on("userTyping",(message)=>{
        const user=onLineUsers.find((user)=>user.userId===message.recipientId)
        console.log(true)
        if(user){
            io.to(user.socketId).emit("isTyping",message)
        }
    })
});
server.listen(4000,()=>{
    console.log("connected")
});