const { createServer } = require('http');
const express = require('express');
const next = require('next');
const WebSocket = require('ws');
const { WebSocketServer } = require('ws');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { connectMQTT, handlePublish } = require('./config/mqtt');

app.prepare().then(() => {
	const expressApp = express();
	const server = createServer(expressApp);

	//connect mqtt
	const MQTTClient = connectMQTT();
	//handle websocket connection
	const wss = new WebSocketServer({ noServer: true });
	console.log('websocket server created');

	wss.on('connection', function connection(ws) {
		ws.on('message', function message(data, isBinary) {
			console.log('received: %s', data);
			try {
				const message = JSON.parse(data);
				const { metrics, mode, status } = message;
				if (mode && status) {
					console.log('calling handlePublish');
					handlePublish(MQTTClient, message);
				}
				if (metrics) {
					wss.clients.forEach(function each(client) {
						if (
							client !== ws &&
							client.readyState === WebSocket.OPEN
						) {
							client.send(data, { binary: isBinary });
						}
					});
				}
			} catch (error) {
				console.log('error', error.message);
			}
			ws.on('close', function close() {
				console.log('client disconnected');
			});
		});
	});

	expressApp.all('*', (req, res) => {
		return handle(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
	server.on('upgrade', (req, socket, head) => {
		console.log('upgrade', req.url);

		if (!req.url.includes('/_next/webpack-hmr')) {
			wss.handleUpgrade(req, socket, head, (ws) => {
				wss.emit('connection', ws, req);
			});
		}
	});
});
