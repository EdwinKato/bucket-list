import {
  Component,
  OnInit,
  Input, OnChanges
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
export class BucketListFormComponent implements OnInit, OnChanges {

	public title = 'Edit your bucket list';
	public form: FormGroup;
	public bucketList: BucketList;
	@Input() bucket_list: BucketList;
	@Input() isNew: boolean;
	public statuses = ['Done', 'Pending'];
	private id: number;

	constructor(
		private router: Router,
		private bucketListsService: BucketListsService
	) {}

	public ngOnInit() {
	  /*
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
		*/

    if (!this.bucket_list) {
      return;
    }
    this.bucketList = this.bucket_list;
	}

	public ngOnChanges(...args: any[]) {
	  if (this.isNew) {
	    this.bucketList = new BucketList();
    } else {
	    this.bucketList = this.bucket_list;
    }
  }

	public save() {
		let result: any;

		if (!this.isNew) {
			result = this.bucketListsService.updateBucketList(this.bucketList);
		} else {
			result = this.bucketListsService.addBucketList(this.bucketList);
		}

		result.subscribe(
			(data) => this.router.navigate(['layout/bucketlists']));

	}
}
