import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { format } from 'date-fns';
import { useState, useEffect, useRef, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

//components
import LineChart from '../components/LineChart';
import { useMetrics } from '../hooks/useMetrics';

function Home() {
	console.log('rendering Home');
	const altitudeChartRef = useRef();

	const [ignitionStatus, setIgnitionStatus] = useState(false);
	const [ejectionStatus, setEjectionStatus] = useState(false);
	const [ejectionStatus2, setEjectionStatus2] = useState(false);

	const [socketUrl] = useState('ws://localhost:3000');

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
		socketUrl,
		{
			share: true,
			//Will attempt to reconnect on all close events, such as server shutting down
			shouldReconnect: (closeEvent) => true,
		}
	);

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	const { altitude, timestamp, latitude, longitude, state } =
		useMetrics(lastJsonMessage);

	useEffect(() => {
		console.log('ref useEffect');
		let isCancelled = false;
		if (!isCancelled) {
			const arr = altitudeChartRef.current?.data.datasets[0]?.data;
			arr.push({
				x: timestamp,
				y: altitude,
			});
			altitudeChartRef.current.update('quiet');
		}
		return () => {
			isCancelled = true;
		};
	}, [altitude, timestamp]);

	const toggleIgnition = useCallback(() => {
		const data = {
			mode: 'ignite',
			status: !ignitionStatus ? 'on' : 'off',
		};
		sendJsonMessage(data);
		setIgnitionStatus(!ignitionStatus);
	});

	const toggleEjection = useCallback(() => {
		const data = {
			mode: 'eject',
			status: !ejectionStatus ? 'on' : 'off',
		};
		sendJsonMessage(data);
		setEjectionStatus(!ejectionStatus);
	});

	const toggleEjection2 = useCallback(() => {
		const data = {
			mode: 'eject2',
			status: !ejectionStatus2 ? 'on' : 'off',
		};
		sendJsonMessage(data);
		setEjectionStatus2(!ejectionStatus2);
	});

	return (
		<div className={styles.container}>
			<Head>
				<title>Base Station</title>
				<meta
					name="description"
					content="Ground station for nakuja project"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1
					style={{
						margin: 0,
						padding: '10px',
					}}
				>
					Welcome to Base Station
				</h1>
				<span>The WebSocket is currently {connectionStatus}</span>

				<div
					style={{
						padding: '10px',
					}}
				>
					<button
						disabled={readyState !== ReadyState.OPEN}
						onClick={toggleIgnition}
					>
						{ignitionStatus ? 'Stop Ignition' : 'Start Ignition'}
					</button>
					<button
						disabled={readyState !== ReadyState.OPEN}
						onClick={toggleEjection}
					>
						{ejectionStatus ? 'Stop Ejection' : 'Start Ejection'}
					</button>
					<button
						disabled={readyState !== ReadyState.OPEN}
						onClick={toggleEjection2}
					>
						{ejectionStatus2 ? 'Stop Ejection2' : 'Start Ejection2'}
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
					<span>
						Timestamp:{' '}
						{timestamp
							? format(timestamp, 'HH:mm:ss:SSS')
							: '00:00:00:000'}
					</span>
					<span>State:{state} </span>
					<span>Altitude: {altitude}</span>
					<span>Longitude:{longitude} </span>
					<span>Latitude: {latitude} </span>
				</div>

				<div
					style={{
						width: '1000px',
						height: '500px',
						margin: 'auto',
					}}
				>
					<LineChart ref={altitudeChartRef} label="altitude" />
				</div>
			</main>
		</div>
	);
}

export default Home;
