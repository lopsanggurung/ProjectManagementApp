import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesComponent } from './pages.component';
import { NavComponent } from './shared/nav/nav.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminModule,
    DashboardModule
  ],
  declarations: [PagesComponent, NavComponent]
})
export class PagesModule { }
