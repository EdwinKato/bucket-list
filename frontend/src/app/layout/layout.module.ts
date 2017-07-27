import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAYOUTROUTES } from './layout.routes';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardModule } from '../dashboard/dashboard.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { FooterModule } from '../shared/footer/footer.module';
import { NavbarModule } from '../shared/navbar/navbar.module';

@NgModule({
    imports: [
        CommonModule,
        DashboardModule,
        SidebarModule,
        NavbarModule,
        FooterModule
    ],
    declarations: [
        LayoutComponent
    ],
    exports: [ LayoutComponent ]
})

export class LayoutModule {}
