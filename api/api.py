from flask import request, jsonify
import re

__all__ = ["login", "register", "add_bucket_list", "get_bucket_lists",
           "get_bucket_list", "put_bucket_list", "delete_bucket_list",
           "create_item_in_bucket_list", "get_items_in_bucket_list",
           "update_bucket_list_item", "delete_bucket_list_item"]

'''
 201  ok resulting to  creation of something
 200  ok
 400  bad request
 404  not found
 401 unauthorised
'''

EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")
SUCCESS = "Your request was processed successfully"
SUCCESSFUL_LOGIN = "The user has been successfully logged into the system"


def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    if not username or not password:
        response = jsonify({'status': 'failed',
                            'message': 'Username or password should'
                                       ' not be left blank'})
        response.status_code = 400
        return response
    user = User.query.filter_by(username=username).first()
    if not user or not user.verify_password(password):
        response = jsonify({'status': 'failed',
                            'error': 'Username or password is incorrect'})
        response.status_code = 400
        return response
    auth_token = user.encode_auth_token(user.id)
    return jsonify({'status': 'success',
                    'message': SUCCESSFUL_LOGIN,
                    'token': auth_token.decode()})


def register():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    username = data['username']
    password = data['password']

    if not first_name.isalpha():
        response = jsonify({'status': 'failed',
                            'message': 'First name must be string '
                                       'alphabet type'})
        response.status_code = 400
        return response

    if not last_name.isalpha():
        response = jsonify({'status': 'failed',
                            'message': 'Last name must be string '
                                       'alphabet type'})
        response.status_code = 400
        return response

    if not username.isalpha():
        response = jsonify({'status': 'failed',
                            'message': 'username must be string '
                                       'alphabet type'})
        response.status_code = 400
        return response

    if not username or not password:
        response = jsonify({'status': 'failed',
                            'error': 'Username or password should'
                                     ' not be left blank'})
        response.status_code = 400
        return response

    if not EMAIL_REGEX.match(email):
        response = jsonify({'status': 'failed',
                            'message': 'Please specify valid email'
                                       'address'})
        return response

    if len(password) < 6:
        response = jsonify({'status': 'failed',
                            'error': 'Password is too short,'
                            'it must be more than 6 characters'})
        response.status_code = 400
        return response

    user = User(first_name, last_name, email, username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    auth_token = user.encode_auth_token(user.id)
    response = jsonify({'status': 'success',
                        'message': 'User has been successfully created',
                        'data': {
                            'user': user.serialize()
                        },
                        'token': auth_token.decode()})
    response.status_code = 201
    return response


def add_bucket_list():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            data = request.get_json()
            if not user:
                response = jsonify({'status': 'failed',
                                    'message': 'Unknown user'})
                response.status_code = 404
                return response
            bucket_list = BucketList(data['title'], data['description'], user)
            if data['status']:
                bucket_list.status = data['status']

            db.session.add(bucket_list)
            db.session.commit()
            response = jsonify({'status': 'success',
                                'message': SUCCESS,
                                'data': {
                                    'bucket_list': bucket_list.serialize()
                                }})
            response.status_code = 201
            return response

        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def get_bucket_lists():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_lists = user.bucket_lists
            if bucket_lists:
                response = jsonify({'status': 'success',
                                    'message': SUCCESS,
                                    'data': {
                                        'bucket_lists':
                                            [bucket_list.serialize()
                                             for bucket_list in
                                             bucket_lists]}})
                response.status_code = 200
                return response
            response = jsonify({'status': 'success',
                                'message': 'There are no bucket lists'
                                           'for the user.'})
            response.status_code = 404
            return response

            # end

        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def get_bucket_list(id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if bucket_list:
                response = jsonify({'status': 'success',
                                    'data': bucket_list.serialize(),
                                    'message': SUCCESS
                                    })
                response.status_code = 200
                return response
            response = jsonify({'status': 'failed',
                                'message': 'Bucket list not found'})
            response.status_code = 404
            return response
        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def put_bucket_list(id):

    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            data = request.get_json()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list not found'})
                response.status_code = 404
                return response

            if data['title']:
                bucket_list.title = data['title']
            if data['description']:
                bucket_list.description = data['description']
            if data['status']:
                bucket_list.status = data['status']
            db.session.commit()

            response = jsonify({'status': 'success',
                                'message': 'Bucket list has been'
                                'updated successfully',
                                'data': {
                                    'bucket list': bucket_list.serialize()
                                }})
            response.status_code = 200
            return response

            # end

        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def delete_bucket_list(id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list not found'})
                response.status_code = 404
                return response
            db.session.delete(bucket_list)
            db.session.commit()
            response = jsonify({'status': 'success',
                                'message': SUCCESS})
            response.status_code = 200
            return response
        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def create_item_in_bucket_list(id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list not found'})
                response.status_code = 404
                return response

            data = request.get_json()
            title = data['title']
            description = data['description']
            item = Item(title, description, bucket_list)
            db.session.add(item)
            db.session.commit()
            response = jsonify({'status': 'success',
                                'message': SUCCESS,
                                'data': {'item': item.serialize()}
                                })
            response.status_code = 201
            return response
        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def get_items_in_bucket_list(id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list not found'})
                response.status_code = 404
                return response
            response = jsonify({'status': 'success', 'message': SUCCESS, 'data': {
                               'items':
                                   [item.serialize()
                                    for item in bucket_list.items]}})
            response.status_code = 200
            return response

            # end

        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def update_bucket_list_item(id, item_id):

    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list not found'})
                response.status_code = 404
                return response

            list_item = [
                item for item in bucket_list.items if item.id == item_id]
            if not list_item:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list item not found'})
                response.status_code = 404
                return response
            item = list_item[0]
            data = request.get_json()
            if data['title']:
                item.title = data['title']
            if data['description']:
                item.description = data['description']
            if data['status']:
                item.status = data['status']
            db.session.commit()

            response = jsonify({'status': 'success',
                                'message': SUCCESS,
                                'data': {'item': item.serialize()}
                                })
            response.status_code = 200
            return response
        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


def delete_bucket_list_item(id, item_id):
    auth_header = request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        decoded_token = User.decode_auth_token(auth_token)
        if not isinstance(decoded_token, str):
            user = User.query.filter_by(id=decoded_token).first()
            bucket_list = BucketList.query.filter_by(
                id=id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list not found'})
                response.status_code = 404
                return response

            list_item = [
                item for item in bucket_list.items if item.id == item_id]
            if not list_item:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list item not found'})
                response.status_code = 404
                return response
            item = list_item[0]
            db.session.delete(item)
            db.session.commit()
            response = jsonify({'status': 'success',
                                'message': 'Bucket list item has'
                                           'been successfully deleted',
                                'item': item.serialize()})
            response.status_code = 200
            return response

            # end

        response = jsonify({
            'status': 'failed',
            'message': decoded_token
        })
        return response
    else:
        response = jsonify({
            'status': 'failed',
            'message': 'Provide a valid auth token.'
        })
        response.status_code = 401
        return response


from api.models import User, BucketList, Item
from api import db
