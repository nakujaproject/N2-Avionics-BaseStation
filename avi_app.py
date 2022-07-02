#STARTS UP THE APPLICATION

import os
from main import create_app,db

#Loading environment variables

#Creating application instance. Configuration is set from environment variables or default if there are no environment variables found
app=create_app(os.getenv('FLASK_CONFIG') or 'default')