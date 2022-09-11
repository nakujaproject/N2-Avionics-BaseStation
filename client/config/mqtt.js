const mqtt = require('mqtt');

module.exports = () => {
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
};
