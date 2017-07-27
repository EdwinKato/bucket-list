import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
import { getHeaders } from '../utils/utils'
 
@Injectable()
export class AuthenticationService {
    public token: string;
    public headers: Headers;
 
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
 
    login(username: string, password: string): Observable<boolean> {
        const url = 'http://127.0.0.1:5000/api/v1/auth/login';
        return this.http.post(url, JSON.stringify({ username: username, password: password }), {headers: getHeaders()})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                console.log("response is:" + response)
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
 
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    register(email: string, first_name: string, last_name: string, username: string, password: string): Observable<boolean> {
        const url = 'http://127.0.0.1:5000/api/v1/auth/register';
        return this.http.post(url, JSON.stringify({
            email: email,
            first_name: first_name,
            username: username,
            last_name: last_name,
            password: password
        }), { headers: getHeaders() })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                console.log("response is:" + response)
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
