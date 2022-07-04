import client from '../../config/influx';

export default async function handle(req, res) {
	const org = 'robotus';
	const bucket = 'telemetry';
	const queryApi = client.getQueryApi(org);

	const query = `
    from(bucket: "${bucket}") 
      |> range(start: -2d)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["topic"] == "esp32/message")
      |> filter(fn: (r) => r["_field"] == "altitude")
      |> tail(n: 200)
    `;
	let arr = [];
	queryApi.queryRows(query, {
		next(row, tableMeta) {
			const o = tableMeta.toObject(row);
			let i = [];
			i[0] = o._time;
			i[1] = o._value;
			arr.push(i);
		},
		error(error) {
			console.error(error);
			res.status(502).json(error.message);
		},
		complete() {
			console.log('QUERY Finished SUCCESS');
			res.json(arr);
		},
	});
}
