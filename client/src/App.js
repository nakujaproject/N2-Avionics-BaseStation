import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

import './App.css';
import LineChart from './components/LineChart';

const socket = io('http://localhost:5000/');

function App() {
	const [y, setY] = useState([]);
	const [x, setX] = useState([]);

	const [timeInFlight, setTimeInFlight] = useState(0);
	const [state, setState] = useState(0);
	const [altitude, setAltitude] = useState(0);
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);

	useEffect(() => {
		// client-side
		socket.on('connect', () => {
			console.log('ws connected to server');
		});

		// socket.on(
		// 	'message',
		// 	({ timeInFlight, state, altitude, longitude, latitude }) => {
		// 		setX([...x, altitude]);
		// 		setY([...y, timeInFlight]);
		// 		setTimeInFlight(timeInFlight);
		// 		setState(state);
		// 		setAltitude(altitude);
		// 		setLatitude(latitude);
		// 		setLongitude(longitude);
		// 	}
		// );

		socket.on('altitude', (altitude) => {
			setAltitude(altitude);
			setX([...x, altitude]);
		});
		socket.on('state', (state) => {
			setState(state);
		});
		socket.on('timestamp', (timestamp) => {
			setTimeInFlight(timestamp);
			setY([...y, timestamp]);
		});
		socket.on('longitude', (longitude) => {
			setLongitude(longitude);
		});
		socket.on('latitude', (latitude) => {
			setLatitude(latitude);
		});

		socket.on('disconnect', () => {
			console.log('ws disconnected from server');
		});
	}, [x, y]);

	const handleIgnition = () => {
		socket.emit('ignite', { startIgnition: true });
	};

	const handleEjection = () => {
		socket.emit('eject', { ejectParachute: true });
	};

	return (
		<div className="App">
			<h1
				style={{
					margin: 0,
					padding: '10px',
				}}
			>
				Welcome to Base Station
			</h1>
			<div
				style={{
					padding: '10px',
				}}
			>
				<button onClick={handleIgnition}>Start Ignition</button>
				<button onClick={handleEjection}>Eject Parachute</button>
			</div>

			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					fontWeight: 'bold',
					maxWidth: '900px',
					margin: 'auto',
				}}
			>
				<span>Time In Flight: {timeInFlight}</span>
				<span>State: {state}</span>
				<span>Altitude: {altitude} </span>
				<span>Longitude: {longitude}</span>
				<span>Latitude: {latitude}</span>
			</div>

			<div style={{ width: '1200px', height: '675px', margin: 'auto' }}>
				<LineChart x={x} y={y} />
			</div>
		</div>
	);
}

export default App;
