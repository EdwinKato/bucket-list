from flask import current_app
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from datetime import datetime

from api import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(30))
    last_name = db.Column(db.String(30))
    email = db.Column(db.String(64), unique=True)
    username = db.Column(db.String(80), unique=True)
    password_hash = db.Column(db.String(128))
    bucket_lists = db.relationship('BucketList', backref='user', lazy='dynamic')

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
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=7200):
        s = Serializer(current_app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None  # valid token, but expired
        except BadSignature:
            return None  # invalid token
        user = User.query.get(data['id'])
        return user

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username
        }


class BucketList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(10))  # Unfinished || Finished
    date_created = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    items = db.relationship('Item', backref='bucket_list', lazy='dynamic')

    def __init__(self, title, description, user_id, date_created=None, status="Unfinished"):
        self.title = title
        self.description = description
        self.user_id = user_id
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
            'user_id': self.user_id
        }


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    status = db.Column(db.String(10))  # Pending || Done
    date_created = db.Column(db.DateTime)
    bucket_list_id = db.Column(db.Integer, db.ForeignKey('bucket_list.id'))

    def __init__(self, title, description, bucket_list_id, status="Pending", date_created=None):
        self.title = title
        self.description = description
        self.bucket_list_id = bucket_list_id
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
            'bucket_list_id': self.bucket_list_id
        }
