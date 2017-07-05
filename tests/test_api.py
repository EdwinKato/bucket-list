import unittest
from flask import current_app, request, abort, jsonify, g, url_for

from api.api import *
from api.models import User


class TestApi(unittest.TestCase):

    def setUp(self):
        pass

    @unittest.skip("")
    def test_login(self):
        pass

    @unittest.skip("")
    def test_register(self):
        pass

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
