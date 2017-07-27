import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Item } from '../../models/Item'
import { ItemsService } from '../../services/items.service';


@Component({
    selector: 'user-cmp',
    moduleId: "",
    templateUrl: 'items.component.html'
})

export class ItemsComponent implements OnInit{
    items: Item[];
    bucket_list_title: string;
    message = "";
    bucket_list_id: number

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private itemsService: ItemsService
    ) {
    }

    ngOnInit() {
        var id = this.route.params.subscribe(params => {
            this.bucket_list_id = params['id'];

            if (!this.bucket_list_id)
                return;

            this.itemsService.getItems(this.bucket_list_id)
                .subscribe(response => {
                    if(response.count === 0){
                        this.message = "There no items in this bucket list"
                    }
                    this.items = response.data.items;
                    if (response.status == 404) {
                        this.router.navigate(['NotFound']);
                    }
                });
        });
    }

    deleteItem(item) {
        if (confirm("Are you sure you want to delete " + item.title + "?")) {
            var index = this.items.indexOf(item);
            this.items.splice(index, 1);

            this.itemsService.deleteItem(this.bucket_list_id, item.id)
                .subscribe(response => {
                    if(response.status_code == 204){
                        this.message = "Successfully deleted"
                    }
                },
                err => {
                    alert("Could not delete bucket list.");
                    // Revert the view back to its original state
                    this.items.splice(index, 0, item);
                });
        }
    }

}
