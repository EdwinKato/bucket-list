import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from '../login/login.component';
import { ItemsComponent } from './items/items.component';
import { AuthGuard } from '../services/auth-guard.service';

export const MODULE_ROUTES: Route[] =[
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'items', component: ItemsComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
]

export const MODULE_COMPONENTS = [
    HomeComponent,
    UserComponent,
    LoginComponent,
    ItemsComponent,
]
