import { useEffect, useState } from 'react';

export const useMetrics = (lastJsonMessage) => {
	const [altitude, setAltitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [latitude, setLatitude] = useState(0);
	const [state, setstate] = useState(0);
	const [timestamp, setTimestamp] = useState(null);
	const [filteredAcceleration, setFilteredAcceleration] = useState(0);
	const [filteredAltitude, setFilteredAltitude] = useState(0);
	const [filteredVelocity, setFilteredVelocity] = useState(0);
	const [temperature, setTemperature] = useState(0);
	const [ax, setAx] = useState(0);
	const [ay, setAy] = useState(0);
	const [az, setAz] = useState(0);
	const [gx, setGx] = useState(0);
	const [gy, setGy] = useState(0);
	const [gz, setGz] = useState(0);

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
			const {
				altitude,
				longitude,
				latitude,
				state,
				filtered_s,
				filtered_v,
				filtered_a,
				ax,
				ay,
				az,
				gx,
				gy,
				gz,
				temperature,
			} = metrics[0].fields;
			const x = metrics[0].timestamp;

			setAltitude(altitude);
			setLongitude(longitude);
			setLatitude(latitude);
			setstate(state);
			setTimestamp(x);
			setAx(ax);
			setAy(ay);
			setAz(az);
			setGx(gx);
			setGy(gy);
			setGz(gz);
			setFilteredAcceleration(filtered_a);
			setFilteredAltitude(filtered_s);
			setFilteredVelocity(filtered_v);
			setTemperature(temperature);
		} catch (error) {
			console.log('useEffect error', error.message);
		}
	}, [lastJsonMessage]);

	return {
		altitude,
		latitude,
		longitude,
		state,
		timestamp,
		filteredAcceleration,
		filteredAltitude,
		filteredVelocity,
		temperature,
		ax,
		ay,
		az,
		gx,
		gy,
		gz,
	};
};
