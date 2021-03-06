import {
	Component,
	OnInit
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import {
	Router
} from '@angular/router';

import {
	User
} from '../../models/user';
import {
	UserService
} from '../../services/user.service';

@Component({
	selector: 'user-cmp',
	templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

	public form: FormGroup;
	public user: User = new User();
	public title: string;

	constructor(
		private userService: UserService,
		private router: Router
	) {}

	public ngOnInit() {

		this.userService.getUser()
			.subscribe((response) => {
				this.user = response.data;
				if (response.status === 404) {
					this.router.navigate(['NotFound']);
				}
			});
	}

	public save() {
		let result = this.userService.updateUser(this.user);

		result.subscribe((data) => this.router.navigate(
			['layout/bucketlists/']));

	}
}
