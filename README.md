# base-station

## How to run

1.In the client directory, run:

### `npm install`

installs the necessary dependencies for the client app

2: In the server directory, run:

### `npm install`

installs the necessary dependencies for the server app

3: In the server directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project structure

---

```asm
├───client
│   └───public
|         └───favicon.ico
|         └───index.html
|         └───logo192.png
|         └───logo512.png
|         └───manifest.json
|         └───robots.txt
│   └───src
|        └───components
|        └───hooks
|        └───App.css
|        └───App.js
|        └───App.test.js
|        └───index.css
|        └───logo.svg
|        └───repirtWebVitals.js
|        └───setupTests.js
│   └───.gitignore
│   └───package-lock.json
│   └───package.json
├───server
│   └───routes
          └───index.js
│   └───.gitignore
│   └───app.js
│   └───package-lock.json
│   └───package.json

```

### 1. Folders Description

| Folder | Description        |
| ------ | ------------------ |
| client | Frontend react app |
| server | Backend nodejs app |

### 2. Files Description

| File         | Description                    |
| ------------ | ------------------------------ |
| package.json | Contains all available scripts |
