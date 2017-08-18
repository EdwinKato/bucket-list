import {
	Component,
	OnInit
} from '@angular/core';
import {
	ROUTES
} from '../.././sidebar/sidebar-routes.config';
import {
	Location,
	LocationStrategy,
	PathLocationStrategy
} from '@angular/common';

@Component({
	selector: 'navbar-cmp',
	templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {

	public  listTitles: any[];
	public location: Location;
	constructor(location: Location) {
		this.location = location;
	}

	public ngOnInit() {
		this.listTitles = ROUTES.filter((listTitle) => listTitle);
	}

	public getTitle() {
		let titlee = this.location.prepareExternalUrl(this.location.path());
		if (titlee.charAt(0) === '#') {
			titlee = titlee.slice(2);
		}

		for (var item = 0; item < this.listTitles.length; item++) {
			if (this.listTitles[item].path === titlee) {
				return this.listTitles[item].title;
			}
		}
		return 'Dashboard';
	}
}
