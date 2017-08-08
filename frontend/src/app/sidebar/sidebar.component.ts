import { Component, OnInit } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import * as $ from 'jquery';

window["$"] = $;
window["jQuery"] = $;

// declare var $:any;
@Component({
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public ngOnInit() {
        $.getScript('../../assets/js/sidebar-moving-tab.js');
        this.menuItems = ROUTES.filter((menuItem) => menuItem);
    }
}
