#Resolving directories to avoid circular imports of packages and package not found errors
import os
import sys
from boto import connect_glacier
basedir=os.path.abspath(os.path.dirname(__file__))
parentdir=os.path.abspath(os.path.join(basedir,os.path.pardir))
sys.path.insert(0,parentdir)#resolving package import path list



from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import config




db=SQLAlchemy()
#Creating the factory function
def create_app(config_name):
    """
    Args:
        config (configuration object): contains the configurations of the application

    Returns:
        application instance:Returns the application instance that starts the application
    """
    app=Flask(__name__)
    #Setting up configuration
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)
    
    #Initializing extensions
    db.init_app(app)
    
    #Registering blueprints
    from main.routes.views.views_ import views
    from main.routes.auth.auth_ import auth
    app.register_blueprint(views)
    app.register_blueprint(auth)
    
    return app