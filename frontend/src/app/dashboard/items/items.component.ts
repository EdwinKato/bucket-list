import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BucketListItem } from '../../models/bucket-list-item'
import { ItemsService } from '../../services/items.service';

@Component({
	selector: 'user-cmp',
	templateUrl: 'items.component.html'
})

export class ItemsComponent implements OnInit {
	private items: BucketListItem[];
	private bucket_list_title: string;
	private message = '';
	private bucket_list_id: number;
	private searchQuery = '';
	private count: number;
	private limit = 20;
	private page: number;
	private empty = true;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private itemsService: ItemsService
	) {
	}

	public ngOnInit() {
		const id = this.route.params.subscribe(params => {
			this.bucket_list_id = params['id'];

			if (!this.bucket_list_id) {
				return;
			}

			this.itemsService.getItems(this.bucket_list_id, 1, this.limit)
				.subscribe((response) => {
					if (response.count === 0) {
						this.message = 'There no items in this bucket list';
						this.empty = false;
					}
					this.items = response.data.items;
					this.count = response.count;
					this.page = 1;
					if (response.status === 404) {
						this.router.navigate(['NotFound']);
					}
				});
		});
	}

	private deleteItem(item) {
		if (confirm('Are you sure you want to delete ' + item.title + '?')) {
			const index = this.items.indexOf(item);
			this.items.splice(index, 1);

			this.itemsService.deleteItem(this.bucket_list_id, item.id)
				.subscribe((response) => {
					if (response.status_code === 204) {
						this.message = 'Successfully deleted';
					}
				},
				(error) => {
					alert('Could not delete item.');
					this.items.splice(index, 0, item);
				});
		}
	}

	private search() {
		this.itemsService.searchItems(this.bucket_list_id, this.searchQuery)
			.subscribe((response) => {
				if (response.count === 0) {
					this.message = 'There no items in this bucket list';
				}
				this.items = response.data.items;
				if (response.status === 404) {
					this.router.navigate(['NotFound']);
				}
			});
	}

	private getPageUrl(page: number){
		let numberOfPages = this.count / this.limit;
		const start = (page === 1)
			? 1
			: (page - 1) * this.limit + 1;
		return this.itemsService.getBucketListUrl(this.bucket_list_id) + '?start=' + start + '&limit=' + this.limit;
	}

	private getServerData(page) {
		this.itemsService.getItems(this.bucket_list_id, null, null, this.getPageUrl(page))
			.subscribe((response) => {
				if (response.count === 0) {
					this.message = 'There no items in this bucket list';
				}
				this.items = response.data.items;
				this.count = response.count;
				this.page = page;
				if (response.status === 404) {
					this.router.navigate(['NotFound']);
				}
			});
	}

	private do_pagination(newValue) {
		if (!newValue){
			this.limit = 0;
		}

		if (newValue > 100) {
			this.limit = 100;
		}

		this.itemsService.getItems(this.bucket_list_id, 1, this.limit)
			.subscribe((response) => {
				if (response.count === 0) {
					this.message = 'There no items in this bucket list';
				}
				this.items = response.data.items;
				this.count = response.count;
				this.page = 1;
				if (response.status === 404) {
					this.router.navigate(['NotFound']);
				}
			});
	}

}
