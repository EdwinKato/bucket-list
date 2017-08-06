import { Component, OnInit } from '@angular/core';

import { BucketList } from '../../models/bucket-list';
import { BucketListsService } from '../../services/bucket-lists.service';
import { BUCKETLISTS } from '../../models/mock-bucket-lists';

@Component({
	selector: 'bucketlists',
	templateUrl: 'bucket-lists.component.html'

})

export class BucketListsComponent implements OnInit {
	private bucketLists: BucketList[];
	private count: number;
	private limit = 1;
	private response: any;
	private message = '';
	private searchQuery = '';
	private next = '';
	private iteration = 0;
	private page: number;
	private baseUrl = 'http://0.0.0.0:5000/api/v1/bucketlists'

	constructor(private bucketListsService: BucketListsService) { }

	public ngOnInit(): void {

		this.bucketListsService.getBucketLists(1, this.limit)
			.subscribe((data) => {
				this.bucketLists = data.data.bucket_lists;
				this.next = data.next;
				this.count = data.count;
				this.response = data;
				this.page = 1;
			},
			(error) => {
				console.log(error);
			}
			);
	}

	private getPageUrl(page: number){
		let numberOfPages = this.count / this.limit;
		const start = (page === 1)
			? 1
			: (page - 1) * this.limit + 1;
		return this.baseUrl + '?start=' + start + '&limit=' + this.limit;
	}

	private getServerData(event) {

		this.bucketListsService.getBucketLists(null, null, this.getPageUrl(event))
			.subscribe((data) => {
				this.bucketLists = data.data.bucket_lists;
				this.next = data.next;
				this.count = data.count;
				this.response = data;
				this.page = event;
			},
			(error) => {
				console.log(error);
			}
			);

	}

	private deleteBucketList(bucketList) {
		if (confirm('Are you sure you want to delete ' + bucketList.title + '?')) {
			const index = this.bucketLists.indexOf(bucketList);
			this.bucketLists.splice(index, 1);

			this.bucketListsService.deleteBucketList(bucketList.id)
				.subscribe((response) => {
					if (response.status_code === 204) {
						this.message = 'Successfully deleted';
					}
				},
				(err) => {
					alert('Could not delete bucket list.');
					this.bucketLists.splice(index, 0, bucketList);
				});
		}
	}

	private search() {

		this.bucketListsService.searchBucketLists(this.searchQuery)
			.subscribe((data) => {
				this.bucketLists = data.data.bucket_lists;
				this.count = data.count;
				this.response = data;
			},
			(error) => {
				console.log(error);
			}
			);

	}

	private do_pagination(newValue) {
		if (!newValue){
			this.limit = 0;
		}

		if (newValue > 100) {
			this.limit = 100;
		}

		this.bucketListsService.getBucketLists(1, this.limit)
			.subscribe((data) => {
				this.bucketLists = data.data.bucket_lists;
				this.next = data.next;
				this.count = data.count;
				this.response = data;
			},
			(error) => {
				console.log(error);
			}
			);

	}

}
