import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BucketList } from '../../../models/bucket-list';
import { BucketListsService } from '../../../services/bucket-lists.service';
import { BasicValidators } from '../../../utils/basic-validators';

@Component({
  selector: 'app-bucket-list-form',
  templateUrl: './bucket-list-form.component.html'
})
export class BucketListFormComponent implements OnInit {

  form: FormGroup;
  title: string;
  bucketList: BucketList = new BucketList();
  id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bucketListsService: BucketListsService
  ) {
  }

  ngOnInit() {
    var id = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.title = this.id ? 'Edit bucket list' : 'New bucket list';

      if (!this.id)
        return;

      this.bucketListsService.getBucketList(this.id)
        .subscribe(response => {
          this.bucketList = response.data;
          if (response.status == 404) {
            this.router.navigate(['NotFound']);
          }
        });
    });
  }

  save() {
    let result: any;
    console.log(this.bucketList.title)

    if (this.id){
      result = this.bucketListsService.updateBucketList(this.bucketList);
    } else {
      result = this.bucketListsService.addBucketList(this.bucketList);
    }

    result.subscribe(data => this.router.navigate(['layout/bucket-lists']));

  }
}
