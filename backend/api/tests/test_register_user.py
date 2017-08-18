import json

from api.test import BaseTestCase
from api.models import User


class TestRegisterUser(BaseTestCase):

    def test_register(self):
        new_test_user = {
            "email": "john.seremba@andela.com",
            "first_name": "John",
            "last_name": "Seremba",
            "password": "qwerty@123",
            "username": "JohnSeremba"
        }

        count = len(User.query.all())
        response = self.client.post('/api/v1/auth/register',
                                    data=json.dumps(new_test_user),
                                    content_type='application/json')
        new_count = len(User.query.all())
        self.assertEqual(new_count - count, 1)
        self.assertEqual(response.status_code, 201)

    def test_register_first_name_input(self):
        new_test_user_first_name = {
            "email": "john.seremba@andela.com",
            "first_name": "654",
            "last_name": "Seremba",
            "password": "qwerty@123",
            "username": "John"
        }
        response = self.client.post('/api/v1/auth/register',
                                    data=json.dumps(new_test_user_first_name),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_register_last_name_input(self):
        new_test_user_last_name = {
            "email": "john.seremba@andela.com",
            "first_name": "John",
            "last_name": "788",
            "password": "qwerty@123",
            "username": "Seremba"
        }
        response = self.client.post('/api/v1/auth/register',
                                    data=json.dumps(new_test_user_last_name),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_register_username_input(self):
        new_test_user_last_name = {
            "email": "john.seremba@andela.com",
            "first_name": "John",
            "last_name": "Seremab",
            "password": "qwerty@123",
            "username": "Seremba7"
        }
        response = self.client.post('/api/v1/auth/register',
                                    data=json.dumps(new_test_user_last_name),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_register_email_input(self):
        new_test_user_last_name = {
            "email": "johnseremba",
            "first_name": "John",
            "last_name": "788",
            "password": "qwerty@123",
            "username": "Seremba"
        }
        response = self.client.post('/api/v1/auth/register',
                                    data=json.dumps(new_test_user_last_name),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 400)
