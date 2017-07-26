import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import $ from 'jquery';
import {LocationStrategy, PlatformLocation, Location} from '@angular/common';

@Component({
    selector: 'app',
    moduleId: "module.id",
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit{
    location: Location;
    constructor(location:Location) {
        this.location = location;
    }
    ngOnInit(){
        $.getScript('../assets/js/material-dashboard.js');
        $.getScript('../assets/js/initMenu.js');
    }
}
