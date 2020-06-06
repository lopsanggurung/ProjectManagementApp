import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedComponent } from './shared.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    SharedComponent
  ],
  exports: [
    FormsModule
  ]
})
export class SharedModule { }
