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

    @unittest.skip("")
    def test_non_registered_user_login(self):
        """ Test for login of non-registered user """
        with self.client:
            response = self.client.post(
                '/api/v1/auth/login',
                data=json.dumps({
                    "password": "qwerty@123",
                    "username": "EdwinKato"
                }),
                content_type='application/json'
            )
            print(response.data)
            data = json.loads(response.data.decode())
            print(response.data)
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 404)

    @unittest.skip("")
    def test_login(self):
        """ Test for login of registered-user login """
        with self.client:
            # user registration
            response = self.client.post(
                '/api/v1/auth/login',
                data=json.dumps(dict(
                    username='EdwinKato',
                    password='qwerty@123'
                )),
                content_type='application/json',
            )
            data_register = json.loads(response.data.decode())
            self.assertTrue(data_register['status'] == 'success')
            self.assertTrue(
                data_register['message'] == 'The user has been successfully logged into the system'
            )
            self.assertTrue(data_register['token'])
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 200)




