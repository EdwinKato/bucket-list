import unittest
from flask_testing import TestCase
from flask import current_app, request, abort, jsonify, g, url_for

from api.api import *
from api.models import User, BucketList
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

        # create test user
        # self.response = self.client.post('/api/v1/auth/register',
        #                                  data=json.dumps(self.test_user),
        #                                  content_type='application/json')

    def tearDown(self):

        db.session.remove()
        db.drop_all()

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
        self.assertEqual(response.status_code, 200)

    def test_add_bucket_list(self):
        bucket_list = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        count = len(BucketList.query.all())
        response = self.client.post('/api/v1/bucketlists',
                                         data=json.dumps(bucket_list),
                                         content_type='application/json')
        new_count = len(BucketList.query.all())
        self.assertEqual(new_count - count, 1)
        self.assertEqual(response.status_code, 200)

    def test_get_bucket_lists(self):
        bucket_list_one = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        bucket_list_two = {
            "description": "Places i have to travel to before the year ends",
            "status": "Pending",
            "title": "Leisure",
            "user_id": 1
        }
        self.client.post('/api/v1/bucketlists',
                        data=json.dumps(bucket_list_one),
                         content_type='application/json')
        self.client.post('/api/v1/bucketlists',
                        data=json.dumps(bucket_list_two),
                         content_type='application/json')
        response = self.client.get('/api/v1/bucketlists')
        self.assertIn("Movies i have to watch", str(response.data))
        self.assertIn("Places i have to travel to", str(response.data))

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
