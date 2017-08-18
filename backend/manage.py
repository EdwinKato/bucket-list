import os

from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from api import create_app, db

application = create_app(os.getenv('FLASK_CONFIG') or 'default')

migrate = Migrate(application, db)

manager = Manager(application)
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """Run the unit tests."""
    import unittest

    tests = unittest.TestLoader().discover('api/tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


@manager.command
def recreate_db():
    """
    Recreates a local database. Drops and creates a new database
    """
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def create_db():
    db.create_all()
    db.session.commit()

@manager.command
def drop_db():
    db.drop_all()
    db.session.commit()


if __name__ == "__main__":
    manager.run()
