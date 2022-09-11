const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const connectMQTT = require('./config/mqtt');

// var fs = require('fs');
var sockjs = require('sockjs');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const client = connectMQTT();

app.prepare().then(() => {
	const server = createServer(async (req, res) => {
		try {
			// Be sure to pass `true` as the second argument to `url.parse`.
			// This tells it to parse the query portion of the URL.
			const parsedUrl = parse(req.url, true);
			const { pathname, query } = parsedUrl;

			if (pathname === '/a') {
				await app.render(req, res, '/a', query);
			} else if (pathname === '/b') {
				await app.render(req, res, '/b', query);
			} else {
				await handle(req, res, parsedUrl);
			}
		} catch (err) {
			console.error('Error occurred handling', req.url, err);
			res.statusCode = 500;
			res.end('internal server error');
		}
	});
	var echo = sockjs.createServer();
	const clients = new Map();

	echo.on('connection', function (conn) {
		console.log(`ws client ${conn.id} connected to server`);

		clients.set(conn);

		conn.on('data', function (message) {
			console.log('message', message);

			const m = JSON.parse(message);

			if (m?.mode === 'ignite') {
				console.log('ignition payload', m);
				client.publish(
					'esp32/ignition',
					m.status,
					{ qos: 1, retain: false },
					(err, packet) => {
						if (err) {
							console.log(err, 'Ignition MQTT publish error');
						}
						console.log(packet, 'Ignition MQTT publish success');
					}
				);
			}
			if (m?.mode === 'eject') {
				console.log('eject payload', m);
				m.status;
				client.publish(
					'esp32/ejection',
					m.status,
					{ qos: 1, retain: false },
					(err, packet) => {
						if (err) {
							console.log(err, 'Ejection MQTT publish error');
						}
						console.log(packet, 'Ejection MQTT publish success');
					}
				);
			}
			if (m?.mode === 'eject2') {
				console.log('eject2 payload', m);

				client.publish(
					'esp32/ejection2',
					m.status,
					{ qos: 1, retain: false },
					(err, packet) => {
						if (err) {
							console.log(err, 'Ejection2 MQTT publish error');
						}
						console.log(packet, 'Ejection2 MQTT publish success');
					}
				);
			}
			if (m?.metrics) {
				console.log('called');
				[...clients.keys()].forEach((client) => {
					if (client.id !== conn.id && client.readyState === 1) {
						client.write(message);
					}
				});
				// fs.appendFile(
				// 	'sample.txt',
				// 	message,
				// 	'utf8',
				// 	// callback function
				// 	function (err) {
				// 		if (err) throw err;
				// 		// if no error
				// 		console.log('Data is appended to file successfully.');
				// 	}
				// );
			}
		});

		conn.on('close', function () {
			clients.delete(conn);
			console.log(`ws ${conn.id} disconnected from server`);
		});
	});

	echo.installHandlers(server, { prefix: '/echo' });
	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://${hostname}:${port}`);
	});
});
