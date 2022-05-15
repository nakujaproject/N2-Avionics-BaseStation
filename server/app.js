const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const mqtt = require('mqtt');

//mqtt client
const client = mqtt.connect('mqtt://192.168.43.29:1883');

const topicName = 'esp32/altitude';

// connect to same client and subscribe to same topic name
client.on('connect', () => {
	// can also accept objects in the form {'topic': qos}
	client.subscribe(topicName, (err, granted) => {
		if (err) {
			console.log(err, 'err');
		}
		console.log(granted, 'granted');
	});
});

// socket.io
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

app.get('/', (req, res) => {
	res.send('welcome to  base station');
});

io.on('connection', (socket) => {
	console.log('a user connected');
	// on receive message event, log the message to the console
	client.on('message', (topic, message, packet) => {
		//console.log(packet, packet.payload.toString());

		switch (topic) {
			case 'esp32/altitude':
				console.log('altitude', JSON.parse(message));
				socket.emit('altitude', JSON.parse(message));
				break;
			case 'esp32/state':
				console.log('state', JSON.parse(message));
				socket.emit('state', JSON.parse(message));
				break;
			case 'esp32/timestamp':
				console.log('timestamp', JSON.parse(message));
				socket.emit('timestamp', JSON.parse(message));
				break;
			case 'esp32/longitude':
				console.log('longitude', JSON.parse(message));
				socket.emit('longitude', JSON.parse(message));
				break;
			case 'esp32/latitude':
				console.log('latitude', JSON.parse(message));
				socket.emit('latitude', JSON.parse(message));
				break;

			default:
				break;
		}
	});
	client.on('packetsend', (packet) => {
		console.log(packet, 'packet2');
	});

	socket.on('ignite', (payload) => {
		console.log('ignition payload', payload);
		client.on('connect', (connack) => {
			console.log('client connected', connack);
			client.publish(
				'esp32/ignition',
				JSON.stringify(payload),
				{ qos: 1, retain: true },
				(PacketCallback, err) => {
					if (err) {
						console.log(err, 'MQTT publish packet');
					}
				}
			);
		});
	});
	socket.on('eject', (payload) => {
		console.log('eject payload', payload);

		client.on('connect', (connack) => {
			console.log('client connected', connack);
			client.publish(
				'esp32/ejection',
				JSON.stringify(payload),
				{ qos: 1, retain: true },
				(PacketCallback, err) => {
					if (err) {
						console.log(err, 'MQTT publish packet');
					}
				}
			);
		});
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`listening on *${PORT}`);
});
