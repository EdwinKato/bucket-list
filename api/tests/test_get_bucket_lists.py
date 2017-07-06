import json

from api.test import BaseTestCase


class TestGetBucketList(BaseTestCase):

    def test_get_bucket_lists(self):
        bucket_list_one = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        bucket_list_two = {
            "description": "Places i have to travel to before the year ends",
            "status": "Pending",
            "title": "Leisure",
            "user_id": 1
        }
        self.client.post('/api/v1/bucketlists',
                         data=json.dumps(bucket_list_one),
                         content_type='application/json')
        self.client.post('/api/v1/bucketlists',
                         data=json.dumps(bucket_list_two),
                         content_type='application/json')
        response = self.client.get('/api/v1/bucketlists')
        self.assertIn("Movies i have to watch", str(response.data))
        self.assertIn("Places i have to travel to", str(response.data))

    def test_get_bucket_list(self):
        bucket_list_one = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        self.client.post('/api/v1/bucketlists',
                         data=json.dumps(bucket_list_one),
                         content_type='application/json')
        response = self.client.get('/api/v1/bucketlists/1')
        self.assertIn("Movies i have to watch", str(response.data))