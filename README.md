# base-station

## How to run in production environment

In the root directory, run:

```
npm run prod
```

## How to run in development environment

1. In the client directory, run:

```
npm install
```

installs the necessary dependencies for the client app

2. In the root directory, run:

```
npm install
```

installs the necessary dependencies for the server app

3. In the root directory, you can run:

```
npm run dev
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Running with custom environment variables on client

1. In the client directory create a .env.local file

```
touch .env.local
```

2. Add the following values to the .env.local file

```
REACT_APP_SERVER_URL=ws://<server ip address>:<server port> or http://<server ip address>:<server port>
```

## Running with custom environment variables on server

1. In the root directory create a .env file

```
touch .env
```

2. Add the following values to the .env file

```
BROKER_URL=mqtt://<broker hostname or ip address>:<broker port>
PORT=<server port>
```

## Running with systemd

Suppose you are in the app directory `/home/$USER/foo`

1. Create file, let's call it foo.service

```
touch foo.service
```

2. In the file add

```
[Unit]
Description=Foo application

[Service]
User=<USER>
WorkingDirectory=/home/<USER>/foo
ExecStart=/usr/bin/npm run prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. Copy unit into systemd folder

```
sudo cp foo.service /etc/systemd/system
```

5. Reload daemon

```
sudo systemctl daemon-reload
```

6. Enable start on boot

```
sudo systemctl enable foo.service
```

## systemd on raspberrypi example

Suppose you are in the app directory `/home/pi/Desktop/base-station`

1. Create file, let's call it bs.service

```
touch bs.service
```

2. In the file add

```
[Unit]
Description=Nakuja N2 base station software

[Service]
User=pi
WorkingDirectory=/home/Desktop/base-station
ExecStart=/usr/bin/npm run prod
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

4. Copy unit into systemd folder

```
sudo cp bs.service /etc/systemd/system
```

5. Reload daemon

```
sudo systemctl daemon-reload
```

6. Enable start on boot

```
sudo systemctl enable bs.service
```
