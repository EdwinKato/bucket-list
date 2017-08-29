import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
	FormsModule
} from '@angular/forms';
import {
	HttpModule
} from '@angular/http';
import {
	MomentModule
} from 'angular2-moment';
import {
	RouterModule,
	PreloadAllModules
} from '@angular/router';
import {
	ROUTES
} from './app.routes';
import {
	NgIdleKeepaliveModule
} from '@ng-idle/keepalive';

import { AppComponent } from './app.component';
import {
	NoContentComponent
} from './no-content';
import {
	LoginComponent
} from './login/login.component';
import {
	RegisterComponent
} from './register/register.component';
import {
	LayoutModule
} from './layout/layout.module';

@NgModule({
  declarations: [
		AppComponent,
		NoContentComponent,
		LoginComponent,
		RegisterComponent
  ],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		LayoutModule,
		MomentModule,
		NgIdleKeepaliveModule.forRoot(),
		RouterModule.forRoot(ROUTES, {
			useHash: true,
			preloadingStrategy: PreloadAllModules
		})
	],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
