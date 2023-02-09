# Overview 

If you are looking to contribute please check out `CONTRIBUTION.md`
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

3. If you are using Linux, please be sure to follow the steps outlined in Docker Docs for how to install [Docker Engine](https://docs.docker.com/engine/install/ubuntu/) and [Docker Desktop for linux](https://docs.docker.com/desktop/install/linux-install/)

## Docker post-install for linux

1. Create a docker group

    ```bash
        #!/bin/bash
    sudo groupadd docker
    ```

2. Add your user to the `docker` group.

    ```bash
        #!/bin/bash
    sudo usermod -aG docker $USER
    ```

3. Log out and log back in so that your group membership is re-evaluated.

4. Verify that you can run `docker` commands without `sudo`.

5. For more information follow this [link](https://docs.docker.com/engine/install/linux-postinstall/)

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
| SERVER_URL | ws://192.168.4.2:3000 |
| INFLUXDB_USER | nakuja |
| INFLUXDB_PASSWORD | 987654321 |
| DOCKER_CLIENT_IMAGE   | ghcr.io/nakujaproject/n2-avionics-basestation:latest |

The `default` environment variables can be `overwritten` using an environment file named `.env` placed in the same directory as the `docker-compose.yaml` file.

For more information checkout the [docs on how to use environment variables with docker compose](https://docs.docker.com/compose/environment-variables/)

`Telegraf` and `eclipse-mosquitto` can be customised using their respective `.conf` files

## Note

The default username and password for the influxdb2 dashboard is :

```text
username=nakuja
password=987654321
```
