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
	Router
} from '@angular/router';

import {
	BucketList
} from '../../../models/bucket-list';
import {
	BucketListsService
} from '../../../services/bucket-lists.service';

declare let $: any;

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

	constructor(
		private bucketListsService: BucketListsService
	) {}

	public ngOnInit() {
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

		result.subscribe((data) => ($('#modalEditBucketList').modal('hide')));

	}
}
