import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

import './App.css';
import LineChart from './components/LineChart';
import useSessionStorage from './hooks/useSessionStorage';

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000/');

function App() {
	const [y, setY] = useSessionStorage('x', []);
	const [x, setX] = useSessionStorage('y', []);

	const [timestamp, setTimestamp] = useSessionStorage('timestamp', 0);
	const [state, setState] = useSessionStorage('state', 0);
	const [altitude, setAltitude] = useSessionStorage('altitude', 0);
	const [latitude, setLatitude] = useSessionStorage('latitude', 0);
	const [longitude, setLongitude] = useSessionStorage('longitude', 0);

	const [ignitionStatus, setIgnitionStatus] = useState(false);
	const [ejectionStatus, setEjectionStatus] = useState(false);

	useEffect(() => {
		// client-side
		socket.on('connect', () => {
			console.log('ws connected to server');
		});

		socket.on('altitude', (altitude) => {
			setAltitude(altitude);
			setX([...x, altitude]);
		});
		socket.on('state', (state) => {
			setState(state);
		});
		socket.on('timestamp', (timestamp) => {
			setTimestamp(timestamp);
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
	}, [
		x,
		y,
		setAltitude,
		setLatitude,
		setLongitude,
		setState,
		setTimestamp,
		setX,
		setY,
	]);

	const toggleIgnition = () => {
		setIgnitionStatus(!ignitionStatus);
		socket.emit('ignite', !ignitionStatus);
	};

	const toggleEjection = () => {
		setEjectionStatus(!ejectionStatus);
		socket.emit('eject', !ejectionStatus);
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
				<button onClick={toggleIgnition}>
					{ignitionStatus ? 'Stop Ignition' : 'Start Ignition'}
				</button>
				<button onClick={toggleEjection}>
					{ejectionStatus ? 'Stop Ejection' : 'Start Ejection'}
				</button>
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
				<span>Timestamp: {timestamp}</span>
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
