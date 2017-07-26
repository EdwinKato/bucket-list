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

    constructor(private bucketListsService: BucketListsService) { }

    // getBucketLists(): void {
    //     this.bucketListsService.getBucketLists().then(bucketLists => this.bucketLists = bucketLists);
    // }

    ngOnInit(): void {
        // this.getBucketLists();

        // this.bucketListsService.getBucketLists()
        //     .subscribe(data => this.bucketLists = data);

        this.bucketLists = BUCKETLISTS;

    }

    onSelect(bucketlist: BucketList): void {
        this.selectedBucketList = bucketlist;
    }

    deleteUser(bucketList) {
        if (confirm("Are you sure you want to delete " + bucketList.title + "?")) {
            var index = this.bucketLists.indexOf(bucketList);
            this.bucketLists.splice(index, 1);

            this.bucketListsService.deleteBucketList(bucketList.id)
                .subscribe(null,
                err => {
                    alert("Could not delete bucket list.");
                    // Revert the view back to its original state
                    this.bucketLists.splice(index, 0, bucketList);
                });
        }
    }

}
