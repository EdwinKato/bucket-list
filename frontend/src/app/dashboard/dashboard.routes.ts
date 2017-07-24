import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { BucketListsComponent } from './bucket-lists/bucket-lists.component';
import { BucketListDetailComponent } from './bucket-lists/bucket-list-detail.component';
import { ItemsComponent } from './items/items.component';

export const MODULE_ROUTES: Route[] =[
    { path: 'dashboard', component: HomeComponent },
    { path: 'user', component: UserComponent },
    { path: 'bucket-lists', component: BucketListsComponent },
    { path: 'bucket-list-detail', component: BucketListDetailComponent },
    { path: 'items', component: ItemsComponent },
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
]

export const MODULE_COMPONENTS = [
    HomeComponent,
    UserComponent,
    BucketListsComponent,
    BucketListDetailComponent,
    ItemsComponent,
]
