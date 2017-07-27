import { Component, OnInit } from '@angular/core';

import { BucketList } from '../../models/bucket-list';
import { BucketListsService } from '../../services/bucket-lists.service';
import { BUCKETLISTS } from '../../models/mock-bucket-lists';

@Component({
    selector: 'bucketlists',
    moduleId: "",
    templateUrl: 'bucket-lists.component.html'

})

export class BucketListsComponent implements OnInit{
    bucketLists: BucketList[];
    selectedBucketList: BucketList;
    count: number;
    response: any;
    message = '';

    constructor(private bucketListsService: BucketListsService) { }

    ngOnInit(): void {

        this.bucketListsService.getBucketLists()
            .subscribe(data => {
                this.bucketLists = data.data.bucket_lists
                this.count = data.count;
                this.response = data;
            },
            error => {
                console.log(error)
            }
            );

    }

    onSelect(bucketlist: BucketList): void {
        this.selectedBucketList = bucketlist;
    }

    deleteBucketList(bucketList) {
        if (confirm("Are you sure you want to delete " + bucketList.title + "?")) {
            var index = this.bucketLists.indexOf(bucketList);
            this.bucketLists.splice(index, 1);

            this.bucketListsService.deleteBucketList(bucketList.id)
                .subscribe(response => {
                    if(response.status_code == 204){
                        this.message = "Successfully deleted"
                    }
                },
                // .subscribe(null,
                err => {
                    alert("Could not delete bucket list.");
                    // Revert the view back to its original state
                    this.bucketLists.splice(index, 0, bucketList);
                });
        }
    }

}
