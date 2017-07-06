from flask_testing import TestCase

from api.api import *
from api import create_app, db
import json


class BaseTestCase(TestCase):

    def create_app(self):

        # pass in test configuration
        return create_app("testing")

    def setUp(self):
        super(BaseTestCase, self).setUp()
        db.create_all()

        self.test_user = {
            "email": "edwin.kato@andela.com",
            "first_name": "Edwin",
            "last_name": "Kato",
            "password": "qwerty@123",
            "username": "EdwinKato"
        }

        self.client.post('/api/v1/auth/register',
                         data=json.dumps(self.test_user),
                         content_type='application/json')

    def tearDown(self):
        super(BaseTestCase, self).tearDown()
        db.session.remove()
        db.drop_all()
