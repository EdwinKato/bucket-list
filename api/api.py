from flask import request, jsonify
from flask import current_app
import re

from sqlalchemy import or_

__all__ = ["login", "register", "add_bucket_list", "get_bucket_lists",
           "get_bucket_list", "put_bucket_list", "delete_bucket_list",
           "create_item_in_bucket_list", "get_items_in_bucket_list",
           "update_bucket_list_item", "delete_bucket_list_item",
           "get_bucket_list_item"]

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
UNKNOWN_USER_RESPONSE = {
    'status': 'failed',
    'message': 'Unknown user'
}
INVALID_TOKEN_RESPONSE = {
    'status': 'failed',
    'message': 'Please provide a valid auth token.'
}
BUCKET_LIST_NOT_FOUND = {
    'status': 'failed',
    'message': 'Bucket list not found'
}


def login():
    """Logs a user in"""

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
    response = jsonify({'status': 'success',
                        'message': SUCCESSFUL_LOGIN,
                        'token': auth_token.decode()})
    response.status_code = 200
    return response


def register():
    """Register a user"""

    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    username = data['username']
    password = data['password']
    validations = {}

    if not first_name.isalpha():
        validations['invalid_first_name'] = 'First name must be of ' \
            'string alphabet type'

    if not first_name:
        validations['first_name_required'] = 'First name should not ' \
            'should not be left blank'

    if not last_name.isalpha():
        validations['invalid_last_name'] = 'Last name must be of ' \
            'string alphabet type'

    if not last_name:
        validations['last_name_required'] = 'Last name should not ' \
            'should not be left blank'

    users_with_username = User.query.filter_by(username=username)
    if users_with_username.count() > 0:
        validations['username_exists'] = 'Username already exists'

    users_with_email = User.query.filter_by(email=email)
    if users_with_email.count() > 0:
        validations['email_exists'] = 'Email already exists'

    if not username.isalpha():
        validations['invalid_username'] = 'Username must be of ' \
            'string alphabet type'

    if not username:
        validations['username_required'] = 'Username should not ' \
            'should not be left blank'

    if not password:
        validations['password_required'] = 'Password should not ' \
            'should not be left blank'

    if not EMAIL_REGEX.match(email):
        validations['email_pattern'] = 'Please specify a ' \
            'valid email'

    if len(password) < 6:
        validations['password_length'] = 'Password is too short'

    if validations:
        response = jsonify({'status': 'failed',
                            'message': {
                                'validations': {
                                    key: validations[key]
                                    for key in validations
                                }
                            }
                            })
        response.status_code = 400
        return response

    user = User(first_name, last_name, email, username)
    user.hash_password(password)
    user.save()
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
    """Create a new bucket list"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            data = request.get_json()
            if not user:
                response = jsonify(UNKNOWN_USER_RESPONSE)
                response.status_code = 401
                return response
            bucket_list = BucketList(data['title'], data['description'], user)
            if data['status']:
                bucket_list.status = data['status']

            bucket_list.save()
            response = jsonify({'status': 'success',
                                'message': SUCCESS,
                                'data': {
                                    'bucket_list': bucket_list.serialize()
                                }})
            response.status_code = 201
            return response

        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def get_bucket_lists():
    """Return the created bucket lists"""

    start = int(request.args.get('start'))\
        if request.args.get('start')\
        else 1
    limit = int(request.args.get('limit'))\
        if request.args.get('limit')\
        else 20
    search_by = request.args.get('q')
    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_lists = user.bucket_lists
            if bucket_lists:
                if search_by:
                    bucket_lists = bucket_lists.filter(
                        or_(BucketList.title.like(search_by),
                            BucketList.description.like(search_by)))
                response = jsonify(
                    get_paginated_list(
                        bucket_lists,
                        "bucketlists",
                        start,
                        limit,
                        "bucket_lists"))
                response.status_code = 200
                return response
            response = jsonify({'status': 'success',
                                'message': 'There are no bucket lists'
                                           'for the user.'})
            response.status_code = 404
            return response

        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def get_bucket_list(bucket_list_id):
    """Get a single bucket list"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if bucket_list:
                response = jsonify({'status': 'success',
                                    'data': bucket_list.serialize(),
                                    'message': SUCCESS
                                    })
                response.status_code = 200
                return response
            response = jsonify(BUCKET_LIST_NOT_FOUND)
            response.status_code = 404
            return response
        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def put_bucket_list(bucket_list_id):
    """Update this bucket list"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            data = request.get_json()
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
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

        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def delete_bucket_list(bucket_list_id):
    """Delete a single bucket list"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
                response.status_code = 404
                return response
            bucket_list.delete()
            return '', 204
        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def create_item_in_bucket_list(bucket_list_id):
    """Create a new item in bucket list"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
                response.status_code = 404
                return response

            data = request.get_json()
            title = data['title']
            description = data['description']
            item = Item(title, description, bucket_list)
            item.save()
            response = jsonify({'status': 'success',
                                'message': SUCCESS,
                                'data': {'item': item.serialize()}
                                })
            response.status_code = 201
            return response
        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def get_bucket_list_item(bucket_list_id, item_id):
    """Get a single bucket list item"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
                response.status_code = 404
                return response

            list_item = [
                item for item in bucket_list.items if item.id == item_id]
            if not list_item:
                response = jsonify({'status': 'failed',
                                    'message': 'Bucket list item not found'})
                response.status_code = 404
                return response
            else:
                item = list_item[0]
                response = jsonify({'status': 'success',
                                    'data': item.serialize(),
                                    'message': SUCCESS
                                    })
                response.status_code = 200
                return response
            response = jsonify(BUCKET_LIST_NOT_FOUND)
            response.status_code = 404
            return response
        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def get_items_in_bucket_list(bucket_list_id):
    """Get items in a bucket list"""

    start = int(request.args.get('start'))\
        if request.args.get('start')\
        else 1
    limit = int(request.args.get('limit'))\
        if request.args.get('limit')\
        else 20
    search_by = request.args.get('q')
    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
                response.status_code = 404
                return response

            items = bucket_list.items
            if search_by:
                items = \
                    items.filter(or_(Item.title.like(search_by),
                                     Item.description.like(search_by)))

            path = "bucketlists/" + str(bucket_list_id)
            response = jsonify(
                get_paginated_list(
                    items,
                    path,
                    start,
                    limit,
                    "items"))
            response.status_code = 200
            return response

        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def update_bucket_list_item(bucket_list_id, item_id):
    """Update a bucket list item"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
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
        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def delete_bucket_list_item(bucket_list_id, item_id):
    """Delete an item in a bucket list"""

    auth_token = get_auth_token(request)
    if auth_token:
        decoded_token = decode_token(auth_token)
        if decoded_token['valid']:
            user = decoded_token['user']
            bucket_list = BucketList.query.filter_by(
                id=bucket_list_id, user_id=user.id).first()
            if not bucket_list:
                response = jsonify(BUCKET_LIST_NOT_FOUND)
                response.status_code = 404
                return response

            list_item = [
                item for item in bucket_list.items if item.id == item_id]
            if not list_item:
                return '', 204
            item = list_item[0]
            item.delete()
            return '', 204

        response = jsonify(decoded_token['response'])
        response.status_code = 401
        return response
    else:
        response = jsonify(INVALID_TOKEN_RESPONSE)
        response.status_code = 401
        return response


def get_paginated_list(list_items, path, start, limit, data_name):
    """Returns a paginated response"""

    count = list_items.count()
    response = {
        'start': start,
        'limit': limit,
        'count': count,
        'status': 'success',
        'message': SUCCESS,
    }

    # make previous url
    if start == 1:
        response['previous'] = ''
    else:
        start_copy = max(1, start - limit)
        limit_copy = start - 1
        response['previous'] = current_app.config.get(
            'SITE_URL') + path + '?start=%d&limit=%d'\
                                 % (start_copy, limit_copy)

    # make next url
    if start + limit > count:
        response['next'] = ''
    else:
        start_copy = start + limit
        response['next'] = current_app.config.get(
            'SITE_URL') + path + '?start=%d&limit=%d' % (start_copy, limit)

    # Construct result according to bounds
    page = list_items[(start - 1):(start - 1 + limit)]
    response['data'] = {
        data_name: [data.serialize() for data in page]
    }
    return response


def get_auth_token(current_request):
    auth_header = current_request.headers.get('Authorization')
    if auth_header:
        auth_token = auth_header.split(" ")[1]
    else:
        auth_token = ''
    return auth_token


def decode_token(auth_token):
    decoded_token = User.decode_auth_token(auth_token)
    if not isinstance(decoded_token, str):
        user = User.query.filter_by(id=decoded_token).first()
        return {
            "valid": True,
            "token": decoded_token,
            "user": user
        }
    return {
        "valid": False,
        "token": decoded_token,
        "response": {
            'status': 'failed',
            'message': decoded_token
        }
    }


from api.models import User, BucketList, Item
from api import db
