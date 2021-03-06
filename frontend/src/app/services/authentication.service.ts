import {
	Injectable
} from '@angular/core';
import {
	Http,
	Headers,
	Response
} from '@angular/http';
import {
	Observable
} from 'rxjs';
import 'rxjs/add/operator/map';
import {
	getHeaders
} from '../utils/utils';
import {
	API_URL
} from '../utils/utils';

@Injectable()
export class AuthenticationService {
	public token: string;
	public headers: Headers;

	constructor(private http: Http) {
		// set token if saved in local storage
		let currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = currentUser && currentUser.token;
	}

	public login(username: string, password: string): Observable < boolean > {
		const url = API_URL + 'auth/login';
		return this.http.post(
				url, JSON.stringify({
					username,
					password
				}), {
					headers: getHeaders()
				}
			)
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				let token = response.json() && response.json().token;
				console.log('response is:' + response)
				if (token) {
					// set token property
					localStorage.clear();
					this.token = token;

					/* store username and jwt token in local storage to keep
					 * user logged in between page refreshes
					 */
					localStorage.setItem(
						'currentUser', JSON.stringify({
							username,
							token
						}));

					// return true to indicate successful login
					return true;
				} else {
					// return false to indicate failed login
					return false;
				}
			});
	}

	public register(
		email: string, first_name: string,
		last_name: string, username: string,
		password: string): Observable < boolean > {
		const url = API_URL + 'auth/register';
		return this.http.post(url, JSON.stringify({
				email,
				first_name,
				username,
				last_name,
				password
			}), {
				headers: getHeaders()
			})
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				let token = response.json() && response.json().token;
				if (token) {
					// set token property
					this.token = token;

					localStorage.setItem(
						'currentUser',
						JSON.stringify({
							username,
							token
						}));

					// return true to indicate successful login
					return true;
				} else {
					// return false to indicate failed login
					return false;
				}
			});
	}

	public logout(): void {
		// clear token remove user from local storage to log user out
		this.token = null;
		localStorage.removeItem('currentUser');
		localStorage.clear();
	}
}
