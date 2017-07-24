import { Component, Input } from '@angular/core'
import { BucketList} from './BucketList'


@Component({
    selector: 'bucket-list-detail',
    templateUrl: 'bucket-list-detail.component.html'
})

export class BucketListDetailComponent{
    @Input() bucketlist: BucketList;
    selectedBucketList: BucketList;
    
    onSelect(bucketlist: BucketList): void {
        this.selectedBucketList = bucketlist;
    }
}
