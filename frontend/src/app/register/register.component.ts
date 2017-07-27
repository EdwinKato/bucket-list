import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
 
import { AuthenticationService } from '../services/authentication.service';
 
@Component({
    moduleId: "",
    templateUrl: 'register.component.html'
})
 
export class RegisterComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';
 
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) { }
 
    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }
 
    register() {
        this.loading = true;
        this.authenticationService.register(
            this.model.email,
            this.model.firstname,
            this.model.lastname,
            this.model.username,
            this.model.password
            )
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/layout/dashboard']);
                } else {
                    this.error = 'Registration failed, Please try again';
                }
            },
            error => {
                console.log(error)
                this.error = 'Registration failed, Please try again';
            }
            );
    }
}
