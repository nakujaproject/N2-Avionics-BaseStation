import { memo } from 'react';
import LineChart from '../LineChart';

function Altitude() {
	const onRefresh = (chart) => {
		//listen for ws

		const arr = chart.data.datasets[0].data;
		arr.push({
			x: Date.now(),
			y: Math.random(),
		});
		chart.update('quiet');
	};

	return <LineChart onRefresh={onRefresh} label="altitude" />;
}

export default memo(Altitude);
