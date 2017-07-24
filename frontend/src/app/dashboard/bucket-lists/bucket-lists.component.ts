import { Component, OnInit } from '@angular/core';
import { BucketList} from './BucketList'

const BUCKETLISTS: BucketList[] = [
  { id: 11, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 12, title: 'Movies', description: 'Movies i want to watch this year', status: 'Pending' },
  { id: 13, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 14, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 15, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 16, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 17, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 18, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 19, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
  { id: 20, title: 'Travel', description: 'Places i want to visit', status: 'Pending' },
];

@Component({
    selector: 'user-cmp',
    moduleId: "",
    templateUrl: 'bucket-lists.component.html'
})

export class BucketListsComponent implements OnInit{
    bucketlists = BUCKETLISTS;
    selectedBucketList: BucketList;
    ngOnInit(){
        // $.getScript('../../../assets/js/material-dashboard.js');

    }
    onSelect(bucketlist: BucketList): void {
        this.selectedBucketList = bucketlist;
    }
}
