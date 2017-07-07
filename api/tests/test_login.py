import unittest
import json

from api.test import BaseTestCase


class TestLogin(BaseTestCase):

    @unittest.skip("")
    def test_login(self):
        login_credentials = {
            "password": "qwerty@123",
            "username": "EdwinKato"
        }

        response = self.client.post('/api/v1/auth/login',
                                    data=json.dumps(login_credentials),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)


def test_non_registered_user_login(self):
    """ Test for login of non-registered user """
    with self.client:
        response = self.client.post(
            '/api/v1/auth/login',
            data=json.dumps(dict(
                email='edwin@andela.com',
                password='123456'
            )),
            content_type='application/json'
        )
        data = json.loads(response.data.decode())
        self.assertTrue(data['status'] == 'fail')
        self.assertTrue(response.content_type == 'application/json')
        self.assertEqual(response.status_code, 404)

