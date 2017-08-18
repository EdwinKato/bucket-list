import {
	Component,
	OnInit
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
	selector: 'item-form',
	templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit {

	public form: FormGroup;
	public item: BucketListItem = new BucketListItem();
	public bucketListId: number;
	public itemId: number;
	public title: string;
	public statuses = ['Done', 'Pending'];

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private itemsService: ItemsService
	) {}

	public ngOnInit() {
		const id = this.route.params.subscribe((params) => {
			this.bucketListId = params['id'];
			this.itemId = params['item_id'];
			this.title = this.itemId
				? 'Edit bucket list item'
				: 'New bucket list item';

			if (!this.bucketListId || !this.itemId) {
				return;
			}

			this.itemsService.getItem(this.bucketListId, this.itemId)
				.subscribe((response) => {
					this.item = response.data;
					if (response.status === 404) {
						this.router.navigate(['NotFound']);
					}
				});
		});
	}

	public save() {
		let result: any;

		if (this.bucketListId && this.itemId) {
			result = this.itemsService
				.updateItem(this.bucketListId, this.item);
		} else {
			result = this.itemsService.addItem(this.bucketListId, this.item);
		}

		result.subscribe((data) => this.router.navigate(
			['layout/bucketlists/' + this.bucketListId + '/items']));

	}
}
