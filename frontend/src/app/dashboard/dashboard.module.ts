import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';

import { MODULE_COMPONENTS, MODULE_ROUTES } from './dashboard.routes';

import { bucketListRouting } from "./bucket-lists/bucket-lists.routing";
import { BucketListsModule } from "./bucket-lists/bucket-lists.module";

import { AuthGuard } from '../services/auth-guard.service';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';

@NgModule({
    imports: [
        RouterModule.forChild(MODULE_ROUTES),
        CommonModule,
        FormsModule,
        BucketListsModule,
        bucketListRouting
    ],
    declarations: [ MODULE_COMPONENTS ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService
    ]

})

export class DashboardModule{}
