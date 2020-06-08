import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from './../../core/core.module';
import { SharedModule } from './../../shared/shared.module';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { EditRolesComponent } from './edit-roles/edit-roles.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule
  ],
  declarations: [ManageUsersComponent, EditRolesComponent]
})
export class AdminModule { }
