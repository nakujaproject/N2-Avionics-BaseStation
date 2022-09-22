# base-station

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## system architecture

![architecture](./public/ground%20station.png)

## Steps to run in docker

1. If you dont have docker installed on your system you can  find the installlation instructions [here](https://www.docker.com/get-started/)

2. In the root directory create a file named .env.local and run the following command

    ```bash
    #!/bin/bash
    touch .env.local
    ```

3. In `.env.local` set the following environment variables MQTT_URI is not required.

    ```text
    MQTT_URI="mqtt://localhost:1883"
    DOCKER_INFLUXDB_INIT_MODE=setup
    DOCKER_INFLUXDB_INIT_USERNAME=avionics
    DOCKER_INFLUXDB_INIT_PASSWORD=987654321
    DOCKER_INFLUXDB_INIT_ORG=nakuja
    DOCKER_INFLUXDB_INIT_BUCKET=telemetry
    DOCKER_INFLUXDB_INIT_ADMIN_TOKEN=mysupersecrettoken
    ```

4. To run the application; In the root directory run the following command:

    ```bash
    #!/bin/bash
    sudo docker compose up -d
    ```

5. Confirm that all four containers are running using the following command:

    ```bash
    #!/bin/bash
    sudo docker ps
    ```

6. The web client will be availabe at [http://localhost:3000](http://localhost:3000) and the influxb dashboard is now availabe at [http://localhost:8086](http://localhost:8086)

## Note

Sign in to the influxdb dashboard with username and password set in .env.local

```text
username=avionics
password=987654321
```
