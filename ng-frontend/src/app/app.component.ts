import {
  Component,
  OnInit
} from '@angular/core';
import {
  Location
} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {

  public location: Location;

  constructor(location: Location) {
    this.location = location;
  }

  public ngOnInit() {
  }

}
