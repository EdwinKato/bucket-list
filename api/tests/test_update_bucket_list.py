import json

from api.test import BaseTestCase


class TestUpdateBucketList(BaseTestCase):

    def test_put_bucket_list(self):
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
        bucket_list_one_modified = {
            "description": "Series i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        response = self.client.put('api/v1/bucketlists/1',
                                   headers={
                                       'Authorization': 'JWT ' + self.token
                                   },
                                   data=json.dumps(bucket_list_one_modified),
                                   content_type='application/json')
        self.assertIn("Series i have to watch", str(response.data))
        self.assertNotIn("Movies i have to watch", str(response.data))