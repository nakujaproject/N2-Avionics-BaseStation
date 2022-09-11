import { memo, forwardRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';

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

const LineChart = forwardRef(({ label }, ref) => {
	const data = {
		datasets: [
			{
				label: label,
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				borderColor: 'rgb(255, 99, 132)',
				data: [],
			},
		],
	};

	const options = {
		scales: {
			x: {
				type: 'realtime',
				realtime: {
					delay: 2000,
					// pause: false,
					// ttl: 60000,
					duration: 20000,
					// frameRate: 30,
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
	};

	return <Line ref={ref} data={data} options={options} />;
});

LineChart.displayName = 'LineChart';
export default memo(LineChart);
