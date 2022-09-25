const mqtt = require('mqtt');
module.exports = {
	connectMQTT: () => {
		const client = mqtt.connect(
			process.env.MQTT_URI || 'mqtt://localhost:1883'
		);

		client.on('connect', (connack) => {
			console.log('node connected to mosquitto', connack);
			client.subscribe('esp32/#', (err, granted) => {
				if (err) {
					console.log(err, 'err');
				}
				console.log(granted, 'granted');
			});
		});
		return client;
	},
	handlePublish: (client, message) => {
		const { mode, status } = message;
		if (!mode || !status) return;

		switch (mode) {
			case 'ignite':
				publish(client, 'esp32/ignite', status);
				break;
			case 'eject':
				publish(client, 'esp32/ejection', status);
				break;
			case 'eject2':
				publish(client, 'esp32/ejection2', status);
				break;
			default:
				break;
		}
	},
};

const publish = (client, topic, message) => {
	client.publish(topic, message, { qos: 1, retain: false }, (err, packet) => {
		if (err) {
			console.log(err, `${topic} MQTT publish error`);
		}
		console.log(packet, `${topic} MQTT publish success`);
	});
};
