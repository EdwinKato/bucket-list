import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { getHeaders } from '../utils/utils';

@Injectable()
export class UserService {
    public token: string;
    public headers: Headers;

    private url: string = 'http://127.0.0.1:5000/api/v1/user';

    constructor(private http: Http) {
        // set token if saved in local storage
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
        this.headers = getHeaders();
        this.headers.set('Authorization', `Bearer ${this.token}`);
    }

    public getUser() {
        return this.http.get(this.url, { headers: this.headers })
            .map((response) => response.json());
    }

    public updateUser(user) {
        return this.http.put(
            this.url,
            JSON.stringify(user), { headers: this.headers }
        )
            .map((response) => response.json());
    }

}
