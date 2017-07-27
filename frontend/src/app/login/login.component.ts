import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Component({
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    private model: any = {};
    private error = '';

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }

    public ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    private login() {
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe((result) => {
                if (result === true) {
                    this.router.navigate(['/layout/dashboard']);
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
