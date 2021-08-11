/* eslint-disable no-undef */
const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use('/peerjs', peerServer);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
});
io.on('connection', () => {
  io.on('join-room', (roomId, userId, userName) => {
    io.join(roomId);
    io.to(roomId).broadcast.emit('user-connected', userId);
    io.on('message', (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    })
  });
});
server.listen(process.env.port || 3000);
