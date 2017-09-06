import {
	Component,
	OnInit,
	Input,
	OnChanges
} from '@angular/core';
import {
	FormGroup,
} from '@angular/forms';
import {
	Router,
	ActivatedRoute
} from '@angular/router';

import {
	BucketListItem
} from '../../../models/bucket-list-item';
import {
	ItemsService
} from '../../../services/items.service';

@Component({
	selector: 'app-item-form',
	templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit, OnChanges {

	public form: FormGroup;
	public item: BucketListItem;
	// public itemId: number;
	public title: string;
	@Input() isNewItem: boolean;
	@Input() bucket_list_item: BucketListItem;
	@Input() bucketListId: number;
	public statuses = ['Done', 'Pending'];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private itemsService: ItemsService
	) {}

	public ngOnInit() {
		// const id = this.route.params.subscribe((params) => {
		// 	this.bucketListId = params['id'];
		// 	this.itemId = params['item_id'];
		// 	this.title = this.itemId
		// 		? 'Edit bucket list item'
		// 		: 'New bucket list item';
		//
		// 	if (!this.bucketListId || !this.itemId) {
		// 		return;
		// 	}
		//
		// 	this.itemsService.getItem(this.bucketListId, this.itemId)
		// 		.subscribe((response) => {
		// 			this.item = response.data;
		// 			if (response.status === 404) {
		// 				this.router.navigate(['NotFound']);
		// 			}
		// 		});
		// });
		if (!this.bucket_list_item) {
			return;
		}
		this.item = this.bucket_list_item;
	}

	public ngOnChanges(...args: any[]) {
		if (this.isNewItem) {
			this.item = new BucketListItem();
			this.title = 'New bucket list item';
		} else {
			this.item = this.bucket_list_item;
			this.title = 'Edit bucket list item';
		}
	}
	public save() {
		let result: any;

		if (this.bucketListId && this.item.id) {
			result = this.itemsService
				.updateItem(this.bucketListId, this.item);
		} else {
			result = this.itemsService.addItem(this.bucketListId, this.item);
		}

		result.subscribe((data) => this.router.navigate(
			['layout/bucketlists/']));

	}
}
