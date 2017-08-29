import {
	Component,
	OnInit
} from '@angular/core';
import {
	Router
} from '@angular/router';

import {
	AuthenticationService
} from '../services/authentication.service';

@Component({
	templateUrl: 'register.component.html'
})

export class RegisterComponent implements OnInit {
	public model: any = {};
	public loading = false;
	public error = '';

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService) {}

	public ngOnInit() {
		// reset login status
		this.authenticationService.logout();
	}

	public register() {
		this.loading = true;
		this.authenticationService.register(
				this.model.email,
				this.model.firstname,
				this.model.lastname,
				this.model.username,
				this.model.password
			)
			.subscribe((result) => {
					if (result === true) {
						this.router.navigate(['/layout/bucketlists']);
					} else {
						this.error = 'Registration failed, Please try again';
					}
				},
				(error) => {
					console.log(error);
					this.error = 'Registration failed, Please try again';
				}
			);
	}
}
