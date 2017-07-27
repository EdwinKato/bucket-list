import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { MODULE_COMPONENTS } from './dashboard.routes';
import { BucketListsModule } from "./bucket-lists/bucket-lists.module";
import { AuthGuard } from '../services/auth-guard.service';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BucketListsModule,
        RouterModule
    ],
    declarations: [ MODULE_COMPONENTS ],
    exports: [ DashboardComponent ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService
    ]

})

export class DashboardModule{}

