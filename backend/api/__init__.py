from flask_sqlalchemy import SQLAlchemy
import connexion
from os.path import dirname, abspath
import os

from config import config

db = SQLAlchemy()
static_url = dirname(dirname(dirname(abspath(__file__))))


def create_app(config_name):
    app = connexion.FlaskApp(
        __name__,
        specification_dir='swagger/',
        static_folder=os.path.join(static_url, 'frontend', 'dist'))

    app.add_api('swagger.yaml')
    application = app.app
    application.config.from_object(config[config_name])

    application.add_url_rule('/', 'index', index)
    application.add_url_rule('/auth/register', 'register', register)
    application.add_url_rule('/auth/login', 'login', login)
    user_view = Frontend.as_view('frontend')
    application.add_url_rule('/<path:filename>', view_func=user_view)

    db.init_app(application)

    return application


from api.api import *
