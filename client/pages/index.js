import Head from 'next/head';
import styles from '../styles/Home.module.css';

// import { io } from 'socket.io-client';
//import { useEffect, useState } from 'react';
import { useState } from 'react';

//import LineChart from '../components/LineChart';
import { GChart } from '../components/GChart';
import useSessionStorage from '../hooks/useSessionStorage';

// const socket = io(
// 	process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000'
// );

function Home({ o }) {
	console.log(o);
	const [y, setY] = useSessionStorage('x', []);
	const [x, setX] = useSessionStorage('y', []);

	// const [timestamp, setTimestamp] = useSessionStorage('timestamp', 0);
	// const [state, setState] = useSessionStorage('state', 0);
	// const [altitude, setAltitude] = useSessionStorage('altitude', 0);
	// const [latitude, setLatitude] = useSessionStorage('latitude', 0);
	// const [longitude, setLongitude] = useSessionStorage('longitude', 0);

	const [ignitionStatus, setIgnitionStatus] = useState(false);
	const [ejectionStatus, setEjectionStatus] = useState(false);

	// useEffect(() => {
	// 	// client-side
	// 	socket.on('connect', () => {
	// 		console.log(`${socket.id} connected to server`);
	// 	});
	// 	socket.on('message', (message) => {
	// 		const { altitude, longitude, latitude, state, timestamp } = message;
	// 		console.log('message', message);
	// 		setX([...x, altitude]);
	// 		setY([...y, timestamp]);
	// 		setLongitude(longitude);
	// 		setLatitude(latitude);
	// 		setState(state);
	// 		setTimestamp(timestamp);
	// 	});

	// 	socket.on('disconnect', () => {
	// 		console.log('ws disconnected from server');
	// 	});
	// }, [
	// 	x,
	// 	y,
	// 	setAltitude,
	// 	setLatitude,
	// 	setLongitude,
	// 	setState,
	// 	setTimestamp,
	// 	setX,
	// 	setY,
	// ]);

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
					<span>Timestamp: {o._value}</span>
					<span>State: </span>
					<span>Altitude: </span>
					<span>Longitude: </span>
					<span>Latitude: </span>
				</div>

				<div
					style={{ width: '1200px', height: '675px', margin: 'auto' }}
				>
					<GChart
						data={[
							['x', 'altitude'],
							[0, 0],
							[1, 10],
							[2, 23],
							[3, 17],
							[4, 18],
							[5, 9],
							[6, 11],
							[7, 27],
						]}
					/>
					{/* <LineChart x={x} y={y} /> */}
				</div>
			</main>
		</div>
	);
}

export default Home;

export async function getServerSideProps() {
	// connect to influx

	const { InfluxDB } = require('@influxdata/influxdb-client');

	const token = 'mytoken';
	const org = 'robotus';
	const bucket = 'telemetry';

	const client = new InfluxDB({ url: 'http://localhost:8086', token: token });

	const queryApi = client.getQueryApi(org);

	const query = `from(bucket: "telemetry") |> range(start: -1d)`;
	queryApi.queryRows(query, {
		next(row, tableMeta) {
			const o = tableMeta.toObject(row);
			console.log(
				`${o._time} ${o._measurement}: ${o._field}=${o._value}`
			);
		},
		error(error) {
			console.error(error);
			console.log('QUERY Finished ERROR');
		},
		complete() {
			console.log('QUERY Finished SUCCESS');
		},
	});

	// Pass data to the page via props
	return {
		props: {
			o: {},
		},
	};
}
