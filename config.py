import os
basedir=os.path.abspath(os.path.dirname(__file__))

class Config:
    """Application wide global configurations"""
    SECRET_KEY=os.environ.get("SECRET_KEY") or "tough_man"
    MAIL_SERVER=os.environ.get('MAIL_SERVER','smtp.gmail.com')
    MAIL_PORT=os.environ.get('MAIL_PORT','587')
    MAIL_USE_TLS=os.environ.get('MAIL_USE_TLS','true').lower() in ['true','on','1']
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD')
    AVIONICS_MAIL_SUBJECT_PREFIX='[N2 Avionics Base Station]'
    AVIONICS_MAIL_SENDER='Avionics Admin <adonijahhuxley@gmail.com>'
    AVIONICS_ADMIN=os.environ.get('AVIONICS_ADMIN')
    SQLALCHEMY_TRACK_MODIFICATIONS=False
    
    @staticmethod
    def init_app(app):
        """
        Enables personalization of the apps configuration
        
        argument (app):application instance
        """
        pass
    
class DevelopmentConfig(Config):
    """
    Development configurations only to be used during application development. Should not be used in production
    """
    DEBUG=True
    SQLALCHEMY_DATABASE_URI=os.environ.get("DEVELOPMENT_DATABASE_URL") or "sqlite:///"+os.path.join(basedir,"development_data.sqlite")

class TestingConfig(Config):
    """
    Test configuration that should be used during testing

    Args:
        Config (configuration object): global configurations to be overridden by test configurations
    """
    TESTING=True
    SQLALCHEMY_DATABASE_URI=os.environ.get("TESTING_DATABASE_URL") or "sqlite://"
    
class ProductionConfig(Config):
    """
    Production configuration used during deployment of the application
    """
    DEBUG=False
    SQLALCHEMY_DATABASE_URI=os.environ.get("PRODUCTION_DATABASE_URL")
    
    
config={
    "development":DevelopmentConfig,
    "testing":TestingConfig,
    "production":ProductionConfig,
    "default":DevelopmentConfig
}