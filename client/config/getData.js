export const getData = () => {
	fetch('/api/altitude')
		.then(async (res) => {
			if (res.status !== 200) {
				const isJson = res.headers
					.get('content-type')
					?.includes('application/json');
				if (!isJson) {
					return Promise.reject(res);
				}
				const data = await res.json();
				const error = data ?? res.statusText;
				return Promise.reject(error);
			}
			let data = await res.json();
			console.log('data', data);
			return data;
		})
		.catch((e) => {
			console.error(e);
		});
};
