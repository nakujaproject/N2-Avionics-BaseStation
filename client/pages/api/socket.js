import { Server } from 'socket.io';
import connectMQTT from '../../config/mqtt';

const SocketHandler = async (req, res) => {
	const client = await connectMQTT();

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
				client.publish(
					'esp32/ignition',
					payload,
					{ qos: 1, retain: false },
					(err, packet) => {
						if (err) {
							console.log(err, 'Ignition MQTT publish error');
						}
						console.log(packet, 'Ignition MQTT publish success');
					}
				);
			});
			socket.on('eject', (payload) => {
				console.log('eject payload', payload);
				client.publish(
					'esp32/ejection',
					payload,
					{ qos: 1, retain: false },
					(err, packet) => {
						if (err) {
							console.log(err, 'Ejection MQTT publish error');
						}
						console.log(packet, 'Ejection MQTT publish success');
					}
				);
			});
			socket.on('eject2', (payload) => {
				console.log('eject2 payload', payload);
				client.publish(
					'esp32/ejection2',
					payload,
					{ qos: 1, retain: false },
					(err, packet) => {
						if (err) {
							console.log(err, 'Ejection2 MQTT publish error');
						}
						console.log(packet, 'Ejection2 MQTT publish success');
					}
				);
			});
		});
	}
	res.end();
};

export default SocketHandler;
