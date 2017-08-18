import json

from api.test import BaseTestCase
from api.models import BucketList


class TestDeleteBucketList(BaseTestCase):

    def test_delete_bucket_list(self):
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

        count = len(BucketList.query.all())
        self.client.delete('/api/v1/bucketlists/1',
                           headers={
                               'Authorization': 'JWT ' + self.token
                           },)
        new_count = len(BucketList.query.all())
        self.assertEqual(new_count - count, -1)

        response = self.client.get(
            '/api/v1/bucketlists/1',
            headers=dict(
                Authorization='Bearer ' + self.token
            )
        )

        self.assertIn("Bucket list not found", str(response.data))
        self.assertEqual(response.status_code, 404)
