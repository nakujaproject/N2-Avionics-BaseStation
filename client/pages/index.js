import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState, useEffect } from 'react';

import Altitude from '../components/charts/Altitude';
import io from 'socket.io-client';

let socket;

function Home() {
	const [ignitionStatus, setIgnitionStatus] = useState(false);
	const [ejectionStatus, setEjectionStatus] = useState(false);
	const [ejectionStatus2, setEjectionStatus2] = useState(false);

	useEffect(() => {
		const socketInitializer = async () => {
			await fetch('/api/socket');
			socket = io();

			socket.on('connect', () => {
				console.log(`${socket.id} connected to server`);
			});

			socket.on('message', (message) => {
				console.log('message', message);
			});

			socket.on('disconnect', () => {
				console.log('ws disconnected from server');
			});
		};
		socketInitializer();
	}, []);

	const toggleIgnition = () => {
		socket.emit('ignite', !ignitionStatus ? 'on' : 'off');
		setIgnitionStatus(!ignitionStatus);
	};

	const toggleEjection = () => {
		socket.emit('eject', !ejectionStatus ? 'on' : 'off');
		setEjectionStatus(!ejectionStatus);
	};

	const toggleEjection2 = () => {
		socket.emit('eject2', !ejectionStatus2 ? 'on' : 'off');
		setEjectionStatus2(!ejectionStatus2);
	};

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
					<button onClick={toggleEjection2}>
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
					<span>Timestamp: </span>
					<span>State: </span>
					<span>Altitude: </span>
					<span>Longitude: </span>
					<span>Latitude: </span>
				</div>

				<div
					style={{ width: '1200px', height: '675px', margin: 'auto' }}
				>
					<Altitude />
				</div>
			</main>
		</div>
	);
}

export default Home;
