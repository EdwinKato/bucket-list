import unittest
import json

from api.test import BaseTestCase


class TestLogin(BaseTestCase):

    @unittest.skip("")
    def test_login(self):
        """ Test for login of registered-user login """
        with self.client:
            # user registration
            credentials = {
                    'username': 'EdwinKato',
                    'password': 'qwerty@123'
                }
            response = self.client.post('/api/v1/auth/login',
                                        data=json.dumps(credentials),
                                        content_type='application/json')

            print(response.data)
            response_data = json.loads(response.data.decode())
            self.assertTrue(response_data['status'] == 'success')
            self.assertTrue(
                response_data['message'] == 'The user has been successfully logged into the system'
            )
            self.assertTrue(response_data['token'])
            self.assertTrue(response.content_type == 'application/json')
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


