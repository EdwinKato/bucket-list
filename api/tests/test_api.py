import unittest
from flask_testing import TestCase
from flask import current_app, request, abort, jsonify, g, url_for

from api.api import *
from api.models import User
from api import create_app, db
import json


class TestApi(TestCase):

    def create_app(self):

        # pass in test configuration
        return create_app("testing")

    def setUp(self):
        # self.test_user = {
        #     "email": "edwin.kato@andela.com",
        #     "first_name": "Edwin",
        #     "last_name": "Kato",
        #     "password": "qwerty@123",
        #     "username": "EdwinKato"
        # }
        db.create_all()

        # create test user
        # self.response = self.client.post('/api/v1/auth/register',
        #                                  data=json.dumps(self.test_user),
        #                                  content_type='application/json')

    def tearDown(self):

        db.session.remove()
        db.drop_all()

    @unittest.skip("")
    def test_login(self):
        test_user = {
            "email": "edwin.kato@andela.com",
            "first_name": "Edwin",
            "last_name": "Kato",
            "password": "qwerty@123",
            "username": "EdwinKato"
        }

        self.client.post('/api/v1/auth/register',
                         data=json.dumps(test_user),
                         content_type='application/json')
        login_credentials = {
            "password": "qwerty@123",
            "username": "EdwinKato"
        }

        response = self.client.post('/api/v1/auth/login',
                                    data=json.dumps(login_credentials),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_register(self):
        test_user = {
            "email": "edwin.kato@andela.com",
            "first_name": "Edwin",
            "last_name": "Kato",
            "password": "qwerty@123",
            "username": "EdwinKato"
        }

        response = self.client.post('/api/v1/auth/register',
                                         data=json.dumps(test_user),
                                         content_type='application/json')
        self.assertEqual(response.status_code, 200)

    @unittest.skip("")
    def test_add_bucket_list(self):
        pass

    @unittest.skip("")
    def test_get_bucket_lists(self):
        pass

    @unittest.skip("")
    def test_get_bucket_list(self):
        pass

    @unittest.skip("")
    def test_put_bucket_list(self):
        pass

    @unittest.skip("")
    def test_delete_bucket_list(self):
        pass

    @unittest.skip("")
    def test_create_item_in_bucket_list(self):
        pass

    @unittest.skip("")
    def test_get_items_in_bucket_list(self):
        pass

    @unittest.skip("")
    def test_update_bucket_list_item(self):
        pass

    @unittest.skip("")
    def test_delete_bucket_list_item(self):
        pass
