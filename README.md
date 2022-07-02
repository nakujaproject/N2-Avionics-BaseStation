# Python Flask API For N2 Avionics Base Station


You require python 3 to use flask checkout its documentation at https://docs.python.org/3/
### Installing Flask
To install flask, run the command below on the command line in the necessary virtual environment for your application.
```
pip install flask

```
### Creating the application
Your programming environment set up, You can start using Flask.
A simple flask application can be created in a python file as shown below

```
from flask import Flask

app=Flask(__name__)

@app.route('/')
def hello():
    return "Hello world"

```
### Running the flask app
Save the created file and close.
To run the web application, on your commandline, tell flask where to find the application via setting FLASK_APP environment variable as shown
```
export FLASK_APP=my_flask_file #use 'set' instead of export for linux

```
running it in development mode

```
export FLASK_ENV=development #use 'set' instead of export for linux

```

running the application, use the flask run commmand as shown

```
flask run

```

Output will be something like this

```
Output
 * Serving Flask app "hello" (lazy loading)
 * Environment: development
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 813-894-335
 
```

There you go! You have created a Flask application.

Flask is a microframework for building extensible web applications. To learn more about flask you can check its documentation at https://flask.palletsprojects.com/en/2.1.x/