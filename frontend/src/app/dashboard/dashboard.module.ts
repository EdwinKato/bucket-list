import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import { Ng2PaginationModule } from 'ng2-pagination';

import { DashboardComponent } from './dashboard.component';
import { MODULE_COMPONENTS } from './dashboard.routes';
import { AuthGuard } from '../services/auth-guard.service';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { ItemsService } from '../services/items.service';
import { BucketListsService } from '../services/bucket-lists.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        Ng2PaginationModule
    ],
    declarations: [ MODULE_COMPONENTS ],
    exports: [ DashboardComponent ],
    providers: [
        AuthGuard,
        AuthenticationService,
        UserService,
        ItemsService,
        BucketListsService
    ]

})

export class DashboardModule {}
