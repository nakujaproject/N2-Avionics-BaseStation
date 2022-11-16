const mqtt = require('mqtt');

module.exports = {
	connectMQTT: (url) => {
		console.log('mqtt url', url);
		const client = mqtt.connect(url);
		console.log('mqtt connection status', client.connected);

		client.on('connect', (connack) => {
			console.log('node connected to mosquitto', connack);
			client.subscribe('esp32/#', (err, granted) => {
				if (err) {
					console.log(err, 'err');
				}
				console.log(granted, 'granted');
			});
		});
		client.on('error', (error) => {
			console.log('mqtt error', error);
		});

		return client;
	},
	handlePublish: (client, message) => {
		if (!client.connected) {
			console.log('Mqtt not connected to mosquitto');
		}

		const { mode, status } = message;
		if (!mode || !status) return;

		switch (mode) {
			case 'ignite':
				publish(client, 'controls/ignite', status);
				break;
			case 'eject':
				publish(client, 'controls/ejection', status);
				break;
			case 'eject2':
				publish(client, 'controls/ejection2', status);
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
