import { Routes } from '@angular/router';

import { NoContentComponent } from './no-content';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './dashboard/home/home.component';
import { UserComponent } from './dashboard/user/user.component';
import { LoginComponent } from './login/login.component';
import { ItemsComponent } from './dashboard/items/items.component';
import { BucketListsComponent } from './dashboard/bucket-lists/bucket-lists.component';
import { BucketListDetailComponent } from './dashboard/bucket-lists/bucket-list-detail.component';
import { BucketListFormComponent } from "./dashboard/bucket-lists/bucket-list-form/bucket-list-form.component";
import { AuthGuard } from './services/auth-guard.service';

export const ROUTES: Routes = [
  {
    path: 'layout', component: LayoutComponent, children: [
      { path: 'dashboard', component: HomeComponent},
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
      { path: 'bucket-lists', component: BucketListsComponent, pathMatch: 'full' },
      { path: 'bucket-lists/new', component: BucketListFormComponent },
      { path: 'bucket-list-detail', component: BucketListDetailComponent },
      { path: 'bucket-lists/:id', component: BucketListFormComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
