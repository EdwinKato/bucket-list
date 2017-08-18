from api.test import BaseTestCase
from api.models import User
from api import db


class TestAuthToken(BaseTestCase):

    def test_encode_auth_token(self):

        user = User("Edwin", "Kato", "edwin5@andela.com", "EdwinKato5")
        db.session.add(user)
        db.session.commit()
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))

    def test_decode_auth_token(self):
        user = User("Edwin", "Kato", "edwin6@andela.com", "EdwinKato6")
        db.session.add(user)
        db.session.commit()
        auth_token = user.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, bytes))
        self.assertTrue(User.decode_auth_token(auth_token) == 2)
