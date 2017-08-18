import json

from api.test import BaseTestCase


class TestUpdateItem(BaseTestCase):

    def test_update_bucket_list_item(self):
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
        item_one = {
            "description": "Horror movies",
            "status": "Pending",
            "title": "Wrong turn 6"
        }
        self.client.post('/api/v1/bucketlists/1/items',
                         headers={
                             'Authorization': 'JWT ' + self.token
                         },
                         data=json.dumps(item_one),
                         content_type='application/json')
        item_one_modified = {
            "description": "Horror movies",
            "status": "Pending",
            "title": "The walking dead"
        }
        response = self.client.put('/api/v1/bucketlists/1/items/1',
                                   headers={
                                       'Authorization': 'JWT ' + self.token
                                   },
                                   data=json.dumps(item_one_modified),
                                   content_type='application/json')
        self.assertNotIn('Wrong turn 6', str(response.data))
        self.assertIn('The walking dead', str(response.data))
