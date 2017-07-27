import { Routes } from '@angular/router';

import { NoContentComponent } from './no-content';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './dashboard/home/home.component';
import { UserComponent } from './dashboard/user/user.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ItemsComponent } from './dashboard/items/items.component';
import { ItemFormComponent } from "./dashboard/items/item-form/item-form.component";
import { BucketListsComponent } from './dashboard/bucket-lists/bucket-lists.component';
import { BucketListDetailComponent } from './dashboard/bucket-lists/bucket-list-detail.component';
import { BucketListFormComponent } from "./dashboard/bucket-lists/bucket-list-form/bucket-list-form.component";
import { AuthGuard } from './services/auth-guard.service';

export const ROUTES: Routes = [
  {
    path: 'layout', component: LayoutComponent, children: [
      { path: 'dashboard', component: HomeComponent},
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'bucket-lists', component: BucketListsComponent, pathMatch: 'full' },
      { path: 'bucket-lists/new', component: BucketListFormComponent, canActivate: [AuthGuard] },
      { path: 'bucket-list-detail', component: BucketListDetailComponent, canActivate: [AuthGuard] },
      { path: 'bucket-lists/:id', component: BucketListFormComponent, canActivate: [AuthGuard] },
      { path: 'bucket-lists/:id/items', component: ItemsComponent, canActivate: [AuthGuard] },
      { path: 'bucket-lists/:id/items/new', component: ItemFormComponent, canActivate: [AuthGuard] },
      { path: 'bucket-lists/:id/items/:item_id', component: ItemFormComponent, canActivate: [AuthGuard] }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
