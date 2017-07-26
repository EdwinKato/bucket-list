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

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private bucketListsService: BucketListsService
  ) {
    this.form = formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      email: ['', [
        Validators.required,
        BasicValidators.email
        //Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
      ]],
      phone: [],
      address: formBuilder.group({
        street: ['', Validators.minLength(3)],
        suite: [],
        city: ['', Validators.maxLength(30)],
        zipcode: ['', Validators.pattern('^([0-9]){5}([-])([0-9]){4}$')]
      })
    });
  }

  ngOnInit() {
    var id = this.route.params.subscribe(params => {
      var id = params['id'];

      this.title = id ? 'Edit User' : 'New User';

      if (!id)
        return;

      this.bucketListsService.getBucketList(id)
        .subscribe(
          bucketList => this.bucketList = bucketList,
          response => {
            if (response.status == 404) {
              this.router.navigate(['NotFound']);
            }
          });
    });
  }

  save() {
    var result,
        bucketListValue = this.form.value;

    if (bucketListValue.id){
      result = this.bucketListsService.updateBucketList(bucketListValue);
    } else {
      result = this.bucketListsService.addBucketList(bucketListValue);
    }

    result.subscribe(data => this.router.navigate(['bucketLists']));
  }
}
