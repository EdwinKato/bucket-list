import {
	Router
} from '@angular/router';
import {
	Component,
	OnInit
} from '@angular/core';

import {
	AuthenticationService
} from '../services/authentication.service';

@Component({
  selector: 'app-login',
	templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
	public model: any = {};
	public error = '';

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService) {}

	public ngOnInit() {
		// reset login status
		this.authenticationService.logout();
	}

	public login() {
		this.authenticationService
			.login(this.model.login_username, this.model.login_password)
			.subscribe((result) => {
					if (result === true) {
						this.router.navigate(['/layout/bucketlists']);
					} else {
						this.error = 'Username or password is incorrect';
					}
				},
				(error) => {
					console.log(error);
					this.error = 'Username or password is incorrect';
				}
			);
	}
}
