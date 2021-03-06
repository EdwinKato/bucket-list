import {
	Component,
	OnInit
} from '@angular/core';
import $ from 'jquery';
import {
	Location
} from '@angular/common';

@Component({
	selector: 'app',
	templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

	public location: Location;

	constructor(location: Location) {
		this.location = location;
	}

	public ngOnInit() {
		$.getScript('../assets/js/material-dashboard.js');
		$.getScript('../assets/js/initMenu.js');
	}

}
