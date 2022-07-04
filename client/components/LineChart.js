import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
//import { useState, useEffect } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	StreamingPlugin
);

function LineChart() {
	// const [plot, setPlot] = useState([]);
	// useEffect(() => {
	// 	const timer = setInterval(() => {
	// 		fetch('/api/altitude')
	// 			.then(async (res) => {
	// 				if (res.status !== 200) {
	// 					const isJson = res.headers
	// 						.get('content-type')
	// 						?.includes('application/json');
	// 					if (!isJson) {
	// 						return Promise.reject(res);
	// 					}
	// 					const data = await res.json();
	// 					const error = data ?? res.statusText;
	// 					return Promise.reject(error);
	// 				}
	// 				let data = await res.json();
	// 				data.length > 0 && setPlot(data);
	// 			})
	// 			.catch((e) => {
	// 				console.error(e);
	// 				clearInterval(timer);
	// 			});
	// 	}, 500);

	// 	return () => {
	// 		clearInterval(timer);
	// 	};
	// }, []);

	return (
		<Line
			data={{
				datasets: [
					{
						label: 'altitude',
						backgroundColor: 'rgba(255, 99, 132, 0.5)',
						borderColor: 'rgb(255, 99, 132)',
						data: [],
					},
				],
			}}
			options={{
				scales: {
					x: {
						type: 'realtime',
						realtime: {
							delay: 2000,
							onRefresh: (chart) => {
								chart.data.datasets.forEach((dataset) => {
									dataset.data.push({
										x: Date.now(),
										y: Math.random(),
									});
								});
							},
							//pause: false,
							//ttl: 0,
							duration: 50000,
							//refresh: 1000,
							//frameRate: 30,
						},
					},
				},
				plugins: {
					legend: {
						position: 'top',
					},
					title: {
						display: true,
						text: 'Telemetry Graph',
					},
				},
			}}
		/>
	);
}

export default LineChart;
