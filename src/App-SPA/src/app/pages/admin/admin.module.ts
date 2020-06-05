import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageUsersComponent } from './manage-users/manage-users.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ManageUsersComponent]
})
export class AdminModule { }
