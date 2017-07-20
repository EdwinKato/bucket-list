import json

from api.test import BaseTestCase


class TestLogin(BaseTestCase):

    def test_login(self):
        """ Test for login of registered-user """
        with self.client:
            # user registration
            credentials = {
                'username': 'EdwinKato',
                'password': 'qwerty@123'
            }
            response = self.client.post('/api/v1/auth/login',
                                        data=json.dumps(credentials),
                                        content_type='application/json')
            response_data = json.loads(response.data.decode())
            self.assertTrue(response_data['status'] == 'success')
            self.assertTrue(response_data['token'])
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 200)

    def test_non_registered_user_login(self):
        """ Test for login of non-registered user """
        with self.client:
            response = self.client.post(
                '/api/v1/auth/login',
                data=json.dumps({
                    "password": "qwerty@123",
                    "username": "EdwinKyato"
                }),
                content_type='application/json'
            )
            print(response.data)
            data = json.loads(response.data.decode())
            print(response.status_code)
            self.assertTrue(data['status'] == 'failed')
            self.assertTrue(response.content_type == 'application/json')
            self.assertEqual(response.status_code, 400)
