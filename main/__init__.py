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
import logging
from main.utils.responses import response_with
import main.utils.responses as resp


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
    
    #SETTING GLOBAL HTTP CONFIGURATIONS
    @app.after_request
    def add_header(response):
        return response
    
    @app.errorhandler(400)
    def bad_request(e):
        logging.error(e)
        return response_with(resp.BAD_REQUEST_400)
    
    @app.errorhandler(500)
    def server_error(e):
        logging.error(e)
        return response_with(resp.SERVER_ERROR_500)
    
    @app.errorhandler(404)
    def not_found(e):
        logging.error(e)
        return response_with(resp.SERVER_ERROR_404)
    
    #Initializing extensions
    db.init_app(app)
    
    #Registering blueprints
    from main.routes.views.views_ import views
    from main.routes.auth.auth_ import auth
    app.register_blueprint(views)
    app.register_blueprint(auth)
    
    #LOGGING CONFIGURATION
    return app