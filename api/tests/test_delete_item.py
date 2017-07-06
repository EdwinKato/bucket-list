import json

from api.test import BaseTestCase
from api.models import Item


class TestDeleteBucketList(BaseTestCase):

    def test_delete_bucket_list_item(self):
        bucket_list_one = {
            "description": "Movies i have to watch by the end of the week",
            "status": "Pending",
            "title": "Entertainment",
            "user_id": 1
        }
        self.client.post('/api/v1/bucketlists',
                         data=json.dumps(bucket_list_one),
                         content_type='application/json')
        item_one = {
            "description": "Horror movies",
            "status": "Pending",
            "title": "Wrong turn 6"
        }
        self.client.post('/api/v1/bucketlists/1/items',
                         data=json.dumps(item_one),
                         content_type='application/json')
        count = len(Item.query.all())
        response = self.client.delete('/api/v1/bucketlists/1/items/1')
        new_count = len(Item.query.all())
        self.assertEqual(new_count - count, -1)
        self.assertEqual(response.status_code, 200)
