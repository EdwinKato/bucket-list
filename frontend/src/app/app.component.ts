/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';
import $ from 'jquery';
import {LocationStrategy, PlatformLocation, Location} from '@angular/common';

/**
 * App Component
 * Top Level Component
 */
// @Component({
//   selector: 'app',
//   encapsulation: ViewEncapsulation.None,
//   styleUrls: [
//     './app.component.css'
//   ],
//   templateUrl: 'app.component.html'
// })
// export class AppComponent implements OnInit {
//   public cover = 'assets/img/cover.jpeg';
//   public name = 'yobucketlist';
//   public url = 'https://yobucketlist.herokuapp.com';

//   constructor(
//     public appState: AppState
//   ) {}

//   public ngOnInit() {
//     console.log('Initial App State', this.appState.state);
//     $.getScript('../assets/js/material-dashboard.js');
//     $.getScript('../assets/js/initMenu.js');
//   }

// }

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
