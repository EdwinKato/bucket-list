import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BucketList } from '../../../models/bucket-list';
import { BucketListsService } from '../../../services/bucket-lists.service';

@Component({
  selector: 'app-bucket-list-form',
  templateUrl: './bucket-list-form.component.html'
})
export class BucketListFormComponent implements OnInit {

  private form: FormGroup;
  private bucketList: BucketList = new BucketList();
  private id: number;
  private title = 'Edit your bucket list';
  private statuses = ['Done', 'Pending'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketListsService: BucketListsService
  ) {
  }

  public ngOnInit() {
    const id = this.route.params.subscribe(params => {
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

  private save() {
    let result: any;
    console.log(this.bucketList.title)

    if (this.id) {
      result = this.bucketListsService.updateBucketList(this.bucketList);
    } else {
      result = this.bucketListsService.addBucketList(this.bucketList);
    }

    result.subscribe(data => this.router.navigate(['layout/bucket-lists']));

  }
}
