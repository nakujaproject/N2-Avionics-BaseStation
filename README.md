# Overview  [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## How does it work ?

![architecture](./public/ground%20station.png)

### Rocket

The rocket has on board transmitters using `IEEE 802.11`. Messages are transmitted using the [MQTT protocol.](https://mqtt.org/)

### Eclipse-mosquitto

[Eclipse Mosquitto](https://mosquitto.org/) is an open-source message broker. All endpoints send and receive messages through the broker.

### Telegraf

[Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) is open-source data collection agent. Configurations for `inputs`, `processors`, `aggregators` and `outputs` are set in the `telegraf.conf` file.

| Inputs      | Function|
| ----------- | ----------- |
| mqtt_consumer   | Subscribes to messages from broker   |

| Processors      | Function |
| ----------- | ----------- |
| printer   | prints logs to console|

| Outputs      | Function |
| ----------- | ----------- |
| Websockets   | Streams data to Nextjs client|
| influxdb_v2   | Saves data to influxDB|

### InfluxDB

[Influx DB](https://www.influxdata.com/) is an open-source time series database

# Installation

## Necessary prerequisites for running

This project depends on `docker` to run `eclipse-mosquitto`, `influxdb2` and `telegraf`

1. If you are using Windows, please follow [steps for installing Docker Desktop on Windows.](https://docs.docker.com/desktop/install/windows-install/)

2. If you are using macOS, please be sure to follow the steps outlined in [Docker Docs for how to install Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)

3. If you are using Linux, please be sure to follow the steps outlined in [Docker Docs for how to install Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)

## How to run ?

1. To get started,  [**download the zip of latest release**](https://github.com/nakujaproject/N2-Avionics-BaseStation/releases/latest/download/release.zip)

2. Navigate to path of the downloaded artifact
3. Extract `release.zip`
4. Open the `release` directory in your terminal
5. Confirm you are in the same directory as the docker-compose.yaml file; Run the following command to start the application in detached shell mode:  

    ```bash
    #!/bin/bash
    docker compose up -d
    ```

or without detaching the shell

 ```bash
    #!/bin/bash
    docker compose up
```

Confirm that all four containers are running using the following command:

```bash
    #!/bin/bash
    docker ps
```

The following containers should be running

| Container      |  Port |
| ----------- | ----------- |
| n2-avionics-basestation   | 3000/tcp    |
| eclipse-mosquitto   | 1883/tcp   |
| Telegraf     | 8092/udp, 8125/udp, 8094/tcp |
| influxdb   | 8086/tcp   |

## Custom Configuration

This project provides the following `environment variables`

| Variable      | Default |
| ----------- | ----------- |
| INFLUXDB_USER | nakuja    |
| INFLUXDB_PASSWORD | 987654321   |
| DOCKER_CLIENT_IMAGE   | ghcr.io/nakujaproject/n2-avionics-basestation   |

The `default` environment variables can be `overwritten` using an environment file named `.env` placed in the same directory as the `docker-compose.yaml` file.

For more information checkout the [docs on how to use environment variables with docker compose](https://docs.docker.com/compose/environment-variables/)

`Telegraf` and `eclipse-mosquitto` can be customised using their respective `.conf` files

## Notes

1. This project uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) for versioning. Husky is integrated to reject invalid commits. If you are unfamiliar with `conventional commits` we recommend using [commitizen](https://github.com/commitizen/cz-cli)
2. If you are running a `cloned version of the repo` the `DOCKER_CLIENT_IMAGE` environment variable is required.
3. The default username and password for the influxdb2 dashboard is :

```text
username=nakuja
password=987654321
```
