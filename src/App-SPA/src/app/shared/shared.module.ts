import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedComponent } from './shared.component';
import { HasRoleDirective } from './_directives/hasRole.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    SharedComponent,
    HasRoleDirective
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    HasRoleDirective
  ]
})
export class SharedModule { }
