import Head from 'next/head';

import getConfig from 'next/config';
import Image from 'next/image';
import { format } from 'date-fns';
import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

//components
import LineChart from '../components/LineChart';
import { useMetrics } from '../hooks/useMetrics';
import Controls from '../components/Controls';
import Video from '../components/Video';

//runtime config
const { publicRuntimeConfig } = getConfig();

function Home() {
	const altitudeChartRef = useRef();
	const velocityChartRef = useRef();
	const accelerationChartRef = useRef();
	const gyroscopeChartRef = useRef();

	const [socketUrl] = useState(
		publicRuntimeConfig.SERVER_URL || 'ws://localhost:3000'
	);
	console.log('socketUrl', socketUrl);

	const { lastJsonMessage, readyState } = useWebSocket(socketUrl, {
		share: true,
		//Will attempt to reconnect on all close events, such as server shutting down
		shouldReconnect: (closeEvent) => true,
	});

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	const {
		altitude,
		timestamp,
		latitude,
		longitude,
		state,
		filteredAcceleration,
		filteredVelocity,
		filteredAltitude,
		ax,
		ay,
		az,
		gx,
		gy,
		gz,
	} = useMetrics(lastJsonMessage);

	useEffect(() => {
		console.log('useEffect altitude');
		let isCancelled = false;
		if (!isCancelled) {
			const filtered = altitudeChartRef.current?.data.datasets[0]?.data;
			const raw = altitudeChartRef.current?.data.datasets[1]?.data;

			filteredAltitude &&
				filtered.push({
					x: timestamp,
					y: filteredAltitude,
				});
			altitude &&
				raw.push({
					x: timestamp,
					y: altitude,
				});
			altitudeChartRef.current.update('quiet');
		}
		return () => {
			isCancelled = true;
		};
	}, [altitude, timestamp, filteredAltitude]);

	useEffect(() => {
		console.log('useEffect velocity');
		let isCancelled = false;
		if (!isCancelled) {
			const filtered = velocityChartRef.current?.data.datasets[0]?.data;
			filtered.push({
				x: timestamp,
				y: filteredVelocity,
			});
			velocityChartRef.current.update('quiet');
		}
		return () => {
			isCancelled = true;
		};
	}, [timestamp, filteredVelocity]);
	useEffect(() => {
		console.log('useEffect acceleration');
		let isCancelled = false;
		if (!isCancelled) {
			const arr1 = accelerationChartRef.current?.data.datasets[0]?.data;
			const arr2 = accelerationChartRef.current?.data.datasets[1]?.data;
			const arr3 = accelerationChartRef.current?.data.datasets[2]?.data;
			const arr4 = accelerationChartRef.current?.data.datasets[3]?.data;
			arr1.push({
				x: timestamp,
				y: filteredAcceleration,
			});
			arr2.push({
				x: timestamp,
				y: ax,
			});
			arr3.push({
				x: timestamp,
				y: ay,
			});
			arr4.push({
				x: timestamp,
				y: az,
			});
			accelerationChartRef.current.update('quiet');
		}
		return () => {
			isCancelled = true;
		};
	}, [timestamp, filteredAcceleration, ax, ay, az]);
	useEffect(() => {
		console.log('useEffect gyroscope');
		let isCancelled = false;
		if (!isCancelled) {
			const arr1 = gyroscopeChartRef.current?.data.datasets[0]?.data;
			const arr2 = gyroscopeChartRef.current?.data.datasets[1]?.data;
			const arr3 = gyroscopeChartRef.current?.data.datasets[2]?.data;
			arr1.push({
				x: timestamp,
				y: gx,
			});
			arr2.push({
				x: timestamp,
				y: gy,
			});
			arr3.push({
				x: timestamp,
				y: gz,
			});

			gyroscopeChartRef.current.update('quiet');
		}
		return () => {
			isCancelled = true;
		};
	}, [timestamp, gx, gy, gz]);

	return (
		<div className="lg:max-h-screen max-w-screen overflow-hidden">
			<Head>
				<title>Base Station</title>
				<meta
					name="description"
					content="Ground station for nakuja project"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="p-2">
				{/* <div>
					<h1 className="text-4xl font-bold">
						Welcome to Base Station
					</h1>

					<div className="inline-flex py-2" role="group">
						<Controls
							readyState={readyState}
							sendJsonMessage={sendJsonMessage}
							mode="ignite"
						/>
						<Controls
							readyState={readyState}
							sendJsonMessage={sendJsonMessage}
							mode="eject"
						/>
						<Controls
							readyState={readyState}
							sendJsonMessage={sendJsonMessage}
							mode="eject2"
							/>
							</div>
						</div> */}

				<div className="text-sm lg:text-base text-center">
					The WebSocket is currently {connectionStatus}
				</div>
				<div className="text-xs lg:text-base md:w-2/3 mx-auto font-bold flex flex-wrap justify-between">
					<span>
						Timestamp:{' '}
						{timestamp
							? format(timestamp, 'HH:mm:ss:SSS')
							: '00:00:00:000'}
					</span>
					<span>State:{state} </span>
					<span>Altitude: {filteredAltitude}</span>
					<span>Longitude:{longitude} </span>
					<span>Latitude: {latitude} </span>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3">
					<div>
						<Video />
					</div>
					<div className="lg:order-first w-full lg:w-10/12 lg:col-span-2">
						<LineChart ref={altitudeChartRef} type="altitude" />
					</div>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-3">
					<div className="w-full lg:w-11/12">
						<LineChart ref={velocityChartRef} type="velocity" />
					</div>
					<div className="w-full lg:w-11/12">
						<LineChart
							ref={accelerationChartRef}
							type="acceleration"
						/>
					</div>
					<div className="w-full lg:w-11/12">
						<LineChart ref={gyroscopeChartRef} type="gyroscope" />
					</div>
				</div>
			</main>
		</div>
	);
}

export default Home;
