from flask_sqlalchemy import SQLAlchemy
import connexion

from config import config

db = SQLAlchemy()


def create_app(config_name):
    app = connexion.FlaskApp(__name__, specification_dir='swagger/')
    app.add_api('swagger.yaml')
    application = app.app
    application.config.from_object(config[config_name])
    db.init_app(application)

    return application


from api.api import *
