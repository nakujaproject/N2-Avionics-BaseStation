require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const mqtt = require('./config/mqtt');

// socket.io
const io = new Server(server, {
	cors: {
		origin: process.env.ORIGIN || '*',
	},
});

//routes
app.get('/', (req, res) => {
	res.send('welcome to  base station');
});
// handle  websocket connections
io.on('connection', (socket) => {
	console.log(`user connected: ${socket.id}`);
	mqtt(socket);

	socket.on('disconnect', () => {
		console.log(`user has disconnected: ${socket.id}`);
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`listening on *${PORT}`);
});
