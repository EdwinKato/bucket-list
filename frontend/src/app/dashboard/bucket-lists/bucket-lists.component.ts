import { Component, OnInit } from '@angular/core';

import { BucketList } from '../../models/bucket-list';
import { BucketListsService } from '../../services/bucket-lists.service';
import { BUCKETLISTS } from '../../models/mock-bucket-lists';

@Component({
    selector: 'bucketlists',
    templateUrl: 'bucket-lists.component.html'

})

export class BucketListsComponent implements OnInit {
    private bucketLists: BucketList[];
    private selectedBucketList: BucketList;
    private count: number;
    private response: any;
    private message = '';
    private searchQuery = '';

    constructor(private bucketListsService: BucketListsService) { }

    public ngOnInit(): void {

        this.bucketListsService.getBucketLists()
            .subscribe((data) => {
                this.bucketLists = data.data.bucket_lists
                this.count = data.count;
                this.response = data;
            },
            (error) => {
                console.log(error);
            }
            );

    }

    private onSelect(bucketlist: BucketList): void {
        this.selectedBucketList = bucketlist;
    }

    private deleteBucketList(bucketList) {
        if (confirm('Are you sure you want to delete ' + bucketList.title + '?')) {
            const index = this.bucketLists.indexOf(bucketList);
            this.bucketLists.splice(index, 1);

            this.bucketListsService.deleteBucketList(bucketList.id)
                .subscribe((response) => {
                    if (response.status_code === 204) {
                        this.message = 'Successfully deleted';
                    }
                },
                (err) => {
                    alert('Could not delete bucket list.');
                    this.bucketLists.splice(index, 0, bucketList);
                });
        }
    }

  private search() {

      this.bucketListsService.searchBucketLists(this.searchQuery)
          .subscribe((data) => {
              this.bucketLists = data.data.bucket_lists;
              this.count = data.count;
              this.response = data;
          },
          (error) => {
              console.log(error);
          }
          );

  }

}
