import { Component, Input } from '@angular/core'
import { Item } from '../../models/Item'


@Component({
    selector: 'bucket-list-detail',
    templateUrl: 'bucket-list-detail.component.html'
})

export class BucketListDetailComponent{
    @Input() bucketlist: Item;
    selectedBucketList: Item;
    
    onSelect(bucketlist: Item): void {
        this.selectedBucketList = bucketlist;
    }
}
