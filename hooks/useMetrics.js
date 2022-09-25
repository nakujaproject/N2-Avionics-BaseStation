import { useEffect, useState } from 'react';

export const useMetrics = (lastJsonMessage) => {
	const [altitude, setAltitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [latitude, setLatitude] = useState(0);
	const [state, setstate] = useState(0);
	const [timestamp, setTimestamp] = useState(null);

	useEffect(() => {
		console.log('useMetrics useEffect');
		try {
			if (!lastJsonMessage || !lastJsonMessage.metrics) {
				throw new Error('no metrics');
			}
			const { metrics } = lastJsonMessage;
			if (!Array.isArray(metrics) && metrics.length < 0) {
				throw new Error('metrics is not an array or is empty');
			}
			if (!metrics[0].fields) {
				throw new Error('fields in metrics is undefined');
			}
			if (!metrics[0].timestamp) {
				throw new Error('timestamp in metrics is undefined');
			}
			const { altitude, longitude, latitude, state } = metrics[0].fields;
			const x = metrics[0].timestamp;

			setAltitude(altitude);
			setLongitude(longitude);
			setLatitude(latitude);
			setstate(state);
			setTimestamp(x);
		} catch (error) {
			console.error('useEffect error', error.message);
		}
	}, [lastJsonMessage]);

	return {
		altitude,
		latitude,
		longitude,
		state,
		timestamp,
	};
};
