// connect to influx

import { InfluxDB } from '@influxdata/influxdb-client';

const url = 'http://localhost:8086';
const token = 'mytoken';

const client = new InfluxDB({ url: url, token: token });

export default client;
