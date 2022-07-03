import Head from 'next/head';
import styles from '../styles/Home.module.css';

import { useState, useEffect } from 'react';

import { GChart } from '../components/GChart';
//import useSessionStorage from '../hooks/useSessionStorage';

function Home() {
	const [plot, setPlot] = useState([]);
	const [ignitionStatus, setIgnitionStatus] = useState(false);
	const [ejectionStatus, setEjectionStatus] = useState(false);

	useEffect(() => {
		const timer = setInterval(() => {
			fetch('/api/altitude')
				.then((res) => res.json())
				.then((data) => {
					setPlot(data);
				});
		}, 300);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const toggleIgnition = () => {
		//	socket.emit('ignite', !ignitionStatus ? 'on' : 'off');
		setIgnitionStatus(!ignitionStatus);
	};

	const toggleEjection = () => {
		//	socket.emit('eject', !ejectionStatus ? 'on' : 'off');
		setEjectionStatus(!ejectionStatus);
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
					<GChart data={[['x', 'altitude'], ...plot]} />
				</div>
			</main>
		</div>
	);
}

export default Home;
