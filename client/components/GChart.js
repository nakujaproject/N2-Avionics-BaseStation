import React from 'react';
import { Chart } from 'react-google-charts';

export function GChart({ data }) {
	const options = {
		curveType: 'function',
		legend: { position: 'bottom' },
	};

	return (
		<Chart
			chartType="LineChart"
			width="100%"
			height="400px"
			data={data}
			options={options}
		/>
	);
}
