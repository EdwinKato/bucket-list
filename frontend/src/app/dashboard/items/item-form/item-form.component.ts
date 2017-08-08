import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BucketListItem } from '../../../models/bucket-list-item';
import { ItemsService } from '../../../services/items.service';

@Component({
  selector: 'item-form',
  templateUrl: './item-form.component.html'
})
export class ItemFormComponent implements OnInit {

  private form: FormGroup;
  private item: BucketListItem = new BucketListItem();
  private bucket_list_id: number;
  private item_id: number;
  private title: string;
  private statuses = ['Done', 'Pending'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private itemsService: ItemsService
  ) {
  }

  public ngOnInit() {
    const id = this.route.params.subscribe((params) => {
      this.bucket_list_id = params['id'];
      this.item_id = params['item_id'];
      this.title = this.item_id ? 'Edit bucket list item' : 'New bucket list item';

      if (!this.bucket_list_id || !this.item_id) {
        return;
      }

      this.itemsService.getItem(this.bucket_list_id, this.item_id)
        .subscribe((response) => {
          this.item = response.data;
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
    });
  }

  private save() {
    let result: any;

    if (this.bucket_list_id && this.item_id) {
      result = this.itemsService.updateItem(this.bucket_list_id, this.item);
    } else {
      result = this.itemsService.addItem(this.bucket_list_id, this.item);
    }

    result.subscribe((data) => this.router.navigate(
      ['layout/bucketlists/' + this.bucket_list_id + '/items'])
    );

  }
}
