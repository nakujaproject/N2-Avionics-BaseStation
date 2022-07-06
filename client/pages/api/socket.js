import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
	if (res.socket.server.io) {
		console.log('Websocket is already running');
	} else {
		console.log('Websocket is initializing');
		const io = new Server(res.socket.server);
		res.socket.server.io = io;

		io.on('connection', (socket) => {
			socket.on('telemetry', (msg) => {
				console.log(msg);
			});

			socket.on('ignite', (payload) => {
				console.log('ignition payload', payload);
			});
			socket.on('eject', (payload) => {
				console.log('eject payload', payload);
			});
			socket.on('eject2', (payload) => {
				console.log('eject2 payload', payload);
			});
		});
	}
	res.end();
};

export default SocketHandler;
