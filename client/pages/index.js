import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { format } from 'date-fns';

import { useState, useEffect, useRef } from 'react';

import SockJS from 'sockjs-client';

import LineChart from '../components/LineChart';

let sock;

function Home() {
	console.log('home');
	const altitudeChartRef = useRef();

	const [ignitionStatus, setIgnitionStatus] = useState(false);
	const [ejectionStatus, setEjectionStatus] = useState(false);
	const [ejectionStatus2, setEjectionStatus2] = useState(false);
	const [altitude, setAltitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [latitude, setLatitude] = useState(0);
	const [state, setstate] = useState(0);
	const [timestamp, setTimestamp] = useState(null);
	const [readyState, setReadystate] = useState(4);

	useEffect(() => {
		const socketInitializer = async () => {
			sock = new SockJS('http://localhost:3000/echo');
			sock.onopen = function () {
				console.log('websocket connection opened');
				setReadystate(1);
			};
			setReadystate(sock.readyState);
			sock.onmessage = function (e) {
				const data = JSON.parse(e.data);
				console.log('data', e.data);
				if (data?.metrics) {
					const { altitude, longitude, latitude, state, timestamp } =
						data.metrics[0].fields;
					const x = data.metrics[0].timestamp;
					setAltitude(altitude);
					setLatitude(latitude);
					setLongitude(longitude);
					setstate(state);
					setTimestamp(x);
					const arr = altitudeChartRef.current?.data.datasets[0].data;

					arr.push({
						x,
						y: altitude,
					});
					altitudeChartRef.current.update('quiet');
				}
			};

			sock.onclose = function () {
				console.log('websocket connection closed');
				setReadystate(4);
			};
		};
		socketInitializer();
	}, []);

	const toggleIgnition = () => {
		const data = {
			mode: 'ignite',
			status: !ignitionStatus ? 'on' : 'off',
		};
		sock.send(JSON.stringify(data));
		setIgnitionStatus(!ignitionStatus);
	};

	const toggleEjection = () => {
		const data = {
			mode: 'eject',
			status: !ejectionStatus ? 'on' : 'off',
		};
		sock.send(JSON.stringify(data));
		setEjectionStatus(!ejectionStatus);
	};

	const toggleEjection2 = () => {
		const data = {
			mode: 'eject2',
			status: !ejectionStatus2 ? 'on' : 'off',
		};
		setEjectionStatus2(!ejectionStatus2);
		sock.send(JSON.stringify(data));
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
				<span>
					Websocket readyState:{' '}
					{readyState === 0
						? 'CONNECTING'
						: readyState === 1
						? 'OPEN'
						: readyState === 3
						? 'CLOSING'
						: 'CLOSED'}
				</span>
				<div
					style={{
						padding: '10px',
					}}
				>
					<button
						disabled={readyState !== 1}
						onClick={toggleIgnition}
					>
						{ignitionStatus ? 'Stop Ignition' : 'Start Ignition'}
					</button>
					<button
						disabled={readyState !== 1}
						onClick={toggleEjection}
					>
						{ejectionStatus ? 'Stop Ejection' : 'Start Ejection'}
					</button>
					<button
						disabled={readyState !== 1}
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
