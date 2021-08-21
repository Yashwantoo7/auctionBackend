require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { addUser, removeUser, getUsersInRoom, checkRoom, leaveRoom } = require('./users');
const router = require('./router');

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

var http  = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });
  

const port = process.env.PORT || 8001;



io.on('connection',socket=>{
    console.log('new user connected',socket.id);
    socket.emit('connection',null);
    
    socket.on('join',({name,room},callback)=>{

      const present = checkRoom(socket.id,room);

      const {error, user} = addUser({id:socket.id,name,room});

      if(error) return callback(error);

      socket.join(user.room);

      if(!present)
        io.emit('room',{room});

      socket.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)});

      console.log(socket.id,name," joined ",room);
      console.log(getUsersInRoom(user.room));
      console.log(socket.rooms);
    })

    // socket.on('leaveRoom',({name,room})=>{
    //   const user = leaveRoom(socket.id);
    // })

    socket.on('disconnect',()=>{
      const user = removeUser(socket.id);
      if(user){
        io.to(user.room).emit('message',{user:'Admin', text: `${user.name} has left`});
        io.to(user.room).emit('roomData', {room: user.room, users:getUsersInRoom(user.room)});
      }
      console.log(socket.id,'user disconnected');
    });

})

http.listen(port,()=>{
  console.log(`listening at http://localhost:${port}`);
});