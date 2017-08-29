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
	BucketList
} from '../../../models/bucket-list';
import {
	BucketListsService
} from '../../../services/bucket-lists.service';

@Component({
	selector: 'app-bucket-list-form',
	templateUrl: './bucket-list-form.component.html'
})
export class BucketListFormComponent implements OnInit {

	public title = 'Edit your bucket list';
	public form: FormGroup;
	public bucketList: BucketList = new BucketList();
	public statuses = ['Done', 'Pending'];
	private id: number;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private bucketListsService: BucketListsService
	) {}

	public ngOnInit() {
		const id = this.route.params.subscribe((params) => {
			this.id = params['id'];

			this.title = this.id ? 'Edit bucket list' : 'New bucket list';

			if (!this.id) {
				return;
			}

			this.bucketListsService.getBucketList(this.id)
				.subscribe((response) => {
					this.bucketList = response.data;
					if (response.status === 404) {
						this.router.navigate(['NotFound']);
					}
				});
		});
	}

	public save() {
		let result: any;

		if (this.id) {
			result = this.bucketListsService.updateBucketList(this.bucketList);
		} else {
			result = this.bucketListsService.addBucketList(this.bucketList);
		}

		result.subscribe(
			(data) => this.router.navigate(['layout/bucketlists']));

	}
}
