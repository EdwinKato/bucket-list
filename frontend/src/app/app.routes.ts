import { Routes } from '@angular/router';

import { NoContentComponent } from './no-content';
import { LayoutComponent } from './layout/layout.component';
import { UserComponent } from './dashboard/user/user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ItemsComponent } from './dashboard/items/items.component';
import { ItemFormComponent } from './dashboard/items/item-form/item-form.component';
import { BucketListsComponent } from './dashboard/bucket-lists/bucket-lists.component';
import { BucketListFormComponent }
  from './dashboard/bucket-lists/bucket-list-form/bucket-list-form.component';
import { AuthGuard } from './services/auth-guard.service';

export const ROUTES: Routes = [
  {
    path: 'layout', component: LayoutComponent, children: [
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'bucketlists', component: BucketListsComponent, pathMatch: 'full' },
      { path: 'bucketlists/new', component: BucketListFormComponent, canActivate: [AuthGuard] },
      { path: 'bucketlists/:id', component: BucketListFormComponent, canActivate: [AuthGuard] },
      { path: 'bucketlists/:id/items', component: ItemsComponent, canActivate: [AuthGuard] },
      {
        path: 'bucketlists/:id/items/new',
        component: ItemFormComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'bucketlists/:id/items/:item_id',
        component: ItemFormComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
