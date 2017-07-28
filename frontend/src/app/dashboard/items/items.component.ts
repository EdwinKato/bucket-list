import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BucketListItem } from '../../models/bucket-list-item'
import { ItemsService } from '../../services/items.service';

@Component({
    selector: 'user-cmp',
    templateUrl: 'items.component.html'
})

export class ItemsComponent implements OnInit{
    private items: BucketListItem[];
    private bucket_list_title: string;
    private message = '';
    private bucket_list_id: number;
    private searchQuery = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private itemsService: ItemsService
    ) {
    }

    public ngOnInit() {
        const id = this.route.params.subscribe(params => {
            this.bucket_list_id = params['id'];

            if (!this.bucket_list_id) {
                return;
            }

            this.itemsService.getItems(this.bucket_list_id)
                .subscribe((response) => {
                    if (response.count === 0) {
                        this.message = 'There no items in this bucket list';
                    }
                    this.items = response.data.items;
                    if (response.status === 404) {
                        this.router.navigate(['NotFound']);
                    }
                });
        });
    }

    private deleteItem(item) {
        if (confirm('Are you sure you want to delete ' + item.title + '?')) {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);

            this.itemsService.deleteItem(this.bucket_list_id, item.id)
                .subscribe((response) => {
                    if (response.status_code === 204) {
                        this.message = 'Successfully deleted';
                    }
                },
                (error) => {
                    alert('Could not delete item.');
                    this.items.splice(index, 0, item);
                });
        }
    }

  private search() {

      this.itemsService.searchItems(this.bucket_list_id, this.searchQuery)
          .subscribe((response) => {
              if (response.count === 0) {
                  this.message = 'There no items in this bucket list';
              }
              this.items = response.data.items;
              if (response.status === 404) {
                  this.router.navigate(['NotFound']);
              }
          });

  }

}
