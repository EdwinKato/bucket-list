import json

from api.test import BaseTestCase


class TestGetItems(BaseTestCase):

    def test_get_items_in_bucket_list(self):
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
        item_two = {
            "description": "Comedies",
            "status": "Done",
            "title": "How i met your mother"
        }
        self.client.post('/api/v1/bucketlists/1/items',
                         headers={
                             'Authorization': 'JWT ' + self.token
                         },
                         data=json.dumps(item_two),
                         content_type='application/json')
        response = self.client.get('/api/v1/bucketlists/1/items',
                                   headers={
                                       'Authorization': 'JWT ' + self.token
                                   },)
        self.assertIn('Wrong turn 6', str(response.data))
        self.assertIn('How i met your mother', str(response.data))
