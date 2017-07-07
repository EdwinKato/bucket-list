import json

from api.test import BaseTestCase


class TestCreateItem(BaseTestCase):

    def test_create_item_in_bucket_list(self):
        bucket_list_one = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        self.client.post('/api/v1/bucketlists',
                         headers={
                            'Authorization': 'JWT ' + self.token
                                },
                         data=json.dumps(bucket_list_one),
                         content_type='application/json')
        item = {
            "description": "Horror movies",
            "status": "Pending",
            "title": "Wrong turn 6"
        }
        response = self.client.post('/api/v1/bucketlists/1/items',
                                    headers={
                                        'Authorization': 'JWT ' + self.token
                                    },
                                    data=json.dumps(item),
                                    content_type='application/json')
        self.assertIn("Wrong turn 6", str(response.data))