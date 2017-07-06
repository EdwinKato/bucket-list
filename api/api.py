from connexion.resolver import RestyResolver
from flask import request, abort, jsonify, g, url_for
from flask_httpauth import HTTPAuth
import re

__all__ = ["login", "register", "add_bucket_list", "get_bucket_lists",
           "get_bucket_list","put_bucket_list","delete_bucket_list",
           "create_item_in_bucket_list", "get_items_in_bucket_list",
           "update_bucket_list_item", "delete_bucket_list_item"]

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")


def login(username, password):
    pass


def register():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    username = data['username']
    password = data['password']

    user = User(first_name, last_name, email, username)
    user.hash_password(password)

    if not first_name.isalpha():
        response = jsonify({'message': 'First name must be string alphabet type'})
        response.status_code = 400
        return response

    if not last_name.isalpha():
        response = jsonify({'message': 'Last name must be string alphabet type'})
        response.status_code = 400
        return response

    if not username or not password:
        response = jsonify({'error': 'Username or password should not be left blank'})
        response.status_code = 400
        return response

    if not EMAIL_REGEX.match(email):
        response = jsonify({'message': 'Please specify valid email address'})
        return response

    if len(password) < 6:
        response = jsonify({'error': 'Password is too short, it must be more than 6 characters'})
        response.status_code = 401
        return response

    user.hash_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User has been successfully created'})


def add_bucket_list():
    data = request.get_json()
    bucket_list = BucketList(data['title'], data['description'], data['user_id'])
    db.session.add(bucket_list)
    db.session.commit()
    return jsonify({'message': 'Bucket list saved successfully'})


def get_bucket_lists():
    bucket_lists = BucketList.query.all()
    if bucket_lists:
        return jsonify(bucket_lists=[bucket_list.serialize() for bucket_list in bucket_lists])
    return jsonify({'message': 'There are no bucket lists for the user.'})


def get_bucket_list(id):
    pass


def put_bucket_list():
    pass


def delete_bucket_list():
    pass


def create_item_in_bucket_list():
    pass


def get_items_in_bucket_list():
    pass


def update_bucket_list_item():
    pass


def delete_bucket_list_item():
    pass

from api.models import User, BucketList, Item
from api  import db
