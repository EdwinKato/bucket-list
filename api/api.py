from connexion.resolver import RestyResolver
from flask import request, abort, jsonify, g, url_for
from flask_httpauth import HTTPAuth
import re

__all__ = ["login", "register", "add_bucket_list", "get_bucket_lists",
           "get_bucket_list","put_bucket_list","delete_bucket_list",
           "create_item_in_bucket_list", "get_items_in_bucket_list",
           "update_bucket_list_item", "delete_bucket_list_item"]

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")


def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if not username and not password:
        response = jsonify({'error': 'Username or password should not be left blank'})
        response.status_code = 400
        return response
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        response = jsonify({'error': 'Username or password is incorrect'})
        response.status_code = 404
        return response
    token = str(user.generate_auth_token())
    return jsonify({'message': 'User has been successfully logged in',
                    'token': token})


def register():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    username = data['username']
    password = data['password']

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

    user = User(first_name, last_name, email, username)
    user.hash_password(password)
    token = str(user.generate_auth_token())
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User has been successfully created',
                    'token': token})


def add_bucket_list():
    data = request.get_json()
    user = User.query.filter_by(id=data['user_id']).first()
    if not user:
        response = jsonify({'message': 'Unknown user'})
        response.status_code = 404
        return response
    bucket_list = BucketList(data['title'], data['description'], user)
    if data['status']:
        bucket_list.status = data['status']

    db.session.add(bucket_list)
    db.session.commit()
    response = jsonify({'message': 'Bucket list saved successfully',
                        'bucket_list': bucket_list.serialize()})
    response.status_code = 200
    return response


def get_bucket_lists():
    bucket_lists = BucketList.query.all()
    if bucket_lists:
        return jsonify(bucket_lists=[bucket_list.serialize() for bucket_list in bucket_lists])
    return jsonify({'message': 'There are no bucket lists for the user.'})


def get_bucket_list(id):
    bucket_list = BucketList.query.filter_by(id=id).first()
    if bucket_list:
        response = jsonify(bucket_list.serialize())
        response.status_code = 200
        return response
    response = jsonify({'message': 'Bucket list not found'})
    response.status_code = 404
    return response


def put_bucket_list(id):
    data = request.get_json()
    if not data['user_id']:
        response = jsonify({'message': 'Please provide user_id and try again'})
        return response
    bucket_list = BucketList.query.filter_by(id=id, user_id=data['user_id']).first()
    if not bucket_list:
        response = jsonify({'message': 'Bucket list not found'})
        response.status_code = 404
        return response

    if data['title']:
        bucket_list.title = data['title']
    if data['description']:
        bucket_list.description = data['description']
    if data['status']:
        bucket_list.status = data['status']
    db.session.commit()

    response = jsonify({'message': 'Bucket list has been updated successfully', 'bucket list': bucket_list.serialize()})
    response.status_code = 200
    return response


def delete_bucket_list(id):
    bucket_list = BucketList.query.filter_by(id=id).first()
    if not bucket_list:
        response = jsonify({'message': 'Bucket list not found'})
        response.status_code = 404
        return response
    db.session.delete(bucket_list)
    db.session.commit()
    response = jsonify({'message': 'Bucket list has been successfully deleted'})
    response.status_code = 200
    return response


def create_item_in_bucket_list(id):
    bucket_list = BucketList.query.filter_by(id=id).first()
    if not bucket_list:
        response = jsonify({'message': 'Bucket list not found'})
        response.status_code = 404
        return response

    data = request.get_json()
    title = data['title']
    description = data['description']
    item = Item(title, description, bucket_list)
    db.session.add(item)
    db.session.commit()
    response = jsonify({'message': 'Item has been successfully added to the bucket list',
                        'item': item.serialize()})
    response.status_code = 404
    return response


def get_items_in_bucket_list():
    pass


def update_bucket_list_item():
    pass


def delete_bucket_list_item():
    pass

from api.models import User, BucketList, Item
from api import db
