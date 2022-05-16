const mqtt = require('mqtt');

module.exports = (socket) => {
	//mqtt client
	const client = mqtt.connect(
		process.env.BROKER_URL || 'mqtt://localhost:1883'
	);

	// connect to same client and subscribe to same topic name
	client.on('connect', (connack) => {
		console.log('client connected', connack);
		// can also accept objects in the form {'topic': qos}
		client.subscribe('esp32/#', (err, granted) => {
			if (err) {
				console.log(err, 'err');
			}
			console.log(granted, 'granted');
		});

		socket.on('ignite', (payload) => {
			console.log('ignition payload', payload);
			client.publish(
				'esp32/ignition',
				payload,
				{ qos: 1, retain: false },
				(PacketCallback, err) => {
					if (err) {
						console.log(err, 'MQTT publish packet');
					}
				}
			);
		});
		socket.on('eject', (payload) => {
			console.log('eject payload', payload);
			client.publish(
				'esp32/ejection',
				payload,
				{ qos: 1, retain: false },
				(PacketCallback, err) => {
					if (err) {
						console.log(err, 'MQTT publish packet');
					}
				}
			);
		});
	});

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
};
