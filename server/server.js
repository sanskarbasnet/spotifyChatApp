const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('songShare', ({ songUri, sender, songName }) => {
    io.emit('songShare', { songUri, sender, songName });
  });

  socket.on('acceptSongShare', ({ songUri, sender }) => {
    io.to(sender).emit('songAccepted', { songUri });
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});