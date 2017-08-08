import {
	Component,
	OnInit
} from '@angular/core';
import {
	Router,
	ActivatedRoute
} from '@angular/router';

import {
	BucketListItem
} from '../../models/bucket-list-item';
import {
	ItemsService
} from '../../services/items.service';

@Component({
	selector: 'user-cmp',
	templateUrl: 'items.component.html'
})

export class ItemsComponent implements OnInit {
	public items: BucketListItem[];
	public message = '';
	public bucketListId: number;
	public searchQuery = '';
	public count: number;
	public limit = 20;
	public page: number;
	public empty = true;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private itemsService: ItemsService
	) {}

	public ngOnInit() {
		const id = this.route.params.subscribe((params) => {
			this.bucketListId = params['id'];

			if (!this.bucketListId) {
				return;
			}

			this.itemsService.getItems(this.bucketListId, 1, this.limit)
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

	public deleteItem(item) {
		if (confirm('Are you sure you want to delete ' + item.title + '?')) {
			const index = this.items.indexOf(item);
			this.items.splice(index, 1);

			this.itemsService.deleteItem(this.bucketListId, item.id)
				.subscribe((response) => {
						this.message = 'Successfully deleted';
					},
					(error) => {
						alert('Could not delete item.');
						this.items.splice(index, 0, item);
					});
		}
	}

	public search() {
		this.itemsService.searchItems(this.bucketListId, this.searchQuery)
			.subscribe((response) => {
				if (response.count === 0) {
					this.message = 'There no items in this bucket list';
					this.empty = false;
				}
				this.items = response.data.items;
				if (response.status === 404) {
					this.router.navigate(['NotFound']);
				}
			});
	}

	public getServerData(page) {
		this.itemsService
			.getItems(this.bucketListId, null, null, this.getPageUrl(page))
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

	public do_pagination(newValue) {
		if (!newValue) {
			this.limit = 0;
		}

		if (newValue > 100) {
			this.limit = 100;
		}

		this.itemsService.getItems(this.bucketListId, 1, this.limit)
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

	private getPageUrl(page: number) {
		const start = (page === 1) ?
			1 :
			(page - 1) * this.limit + 1;
		return this.itemsService.getBucketListUrl(this.bucketListId)
			+ '?start=' + start + '&limit=' + this.limit;
	}

}
