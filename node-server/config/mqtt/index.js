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

		if (topic === 'esp32/message') {

			console.log('message', JSON.parse(message));
			socket.emit('message', JSON.parse(message));
		}

	});
};
