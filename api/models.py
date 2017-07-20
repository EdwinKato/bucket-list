from flask import current_app
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

from api import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(64), unique=True)
    username = db.Column(db.String(80), unique=True)
    password_hash = db.Column(db.String(128))
    crypt_context = CryptContext(
        schemes=[
            "sha256_crypt",
            "md5_crypt",
            "des_crypt"])

    def __init__(self, first_name, last_name, email, username):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.username = username

    def __repr__(self):
        return '<User %r>' % self.username

    def full_name(self):
        return '%s %s' % (self.first_name, self.last_name)

    def hash_password(self, password):
        self.password_hash = self.crypt_context.hash(password)

    def verify_password(self, password):
        return self.crypt_context.verify(password, self.password_hash)

    @staticmethod
    def encode_auth_token(user_id):
        """
        Generates the Auth Token
        :return: string
        """
        try:
            payload = {
                'exp': datetime.utcnow() + timedelta(hours=1),
                'iat': datetime.utcnow(),
                'sub': user_id
            }
            return jwt.encode(
                payload,
                current_app.config.get('SECRET_KEY'),
                algorithm='HS256'
            )
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        """
        Decodes the auth token
        :param auth_token:
        :return: integer|string
        """
        try:
            payload = jwt.decode(
                auth_token,
                current_app.config.get('SECRET_KEY'),
                algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class BucketList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(10))  # Unfinished || Finished
    date_created = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship('User',
                           backref=db.backref('bucket_lists', lazy='dynamic'))

    def __init__(
            self,
            title,
            description,
            user,
            date_created=None,
            status="Unfinished"):
        self.title = title
        self.description = description
        self.user = user
        self.status = status
        if date_created is None:
            date_created = datetime.utcnow()
        self.date_created = date_created

    def __repr__(self):
        return '<BucketList %r>' % self.name

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'date_created': self.date_created,
            'user_id': self.user.id
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(10))  # Pending || Done
    date_created = db.Column(db.DateTime)
    bucket_list_id = db.Column(db.Integer, db.ForeignKey('bucket_list.id'))
    bucket_list = db.relationship('BucketList',
                                  backref=db.backref('items', lazy='dynamic'))

    def __init__(
            self,
            title,
            description,
            bucket_list,
            status="Pending",
            date_created=None):
        self.title = title
        self.description = description
        self.bucket_list = bucket_list
        self.status = status
        if date_created is None:
            date_created = datetime.utcnow()
        self.date_created = date_created

    def __repr__(self):
        return '<Item %r>' % self.name

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'date_created': self.date_created,
            'bucket_list_id': self.bucket_list.id
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
