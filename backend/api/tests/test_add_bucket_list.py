import json

from api.test import BaseTestCase
from api.models import BucketList


class TestAddBucketList(BaseTestCase):

    def test_add_bucket_list(self):
        bucket_list = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        count = len(BucketList.query.all())
        response = self.client.post('/api/v1/bucketlists',
                                    headers={
                                        'Authorization': 'JWT ' + self.token
                                    },
                                    data=json.dumps(bucket_list),
                                    content_type='application/json')
        new_count = len(BucketList.query.all())
        self.assertEqual(new_count - count, 1)
        self.assertEqual(response.status_code, 201)
