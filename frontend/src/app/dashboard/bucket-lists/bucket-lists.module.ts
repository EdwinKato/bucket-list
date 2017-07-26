import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule }  from '@angular/router';
import { HttpModule }  from '@angular/http';

import { BucketListsComponent } from './bucket-lists.component';
import { BucketListDetailComponent } from './bucket-list-detail.component';
import { BucketListsService } from '../../services/bucket-lists.service';
import { BucketListFormComponent } from './bucket-list-form/bucket-list-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpModule
  ],
  declarations: [
    BucketListsComponent,
    BucketListFormComponent,
    BucketListDetailComponent
  ],
  exports: [
    BucketListsComponent,
    BucketListDetailComponent
  ],
  providers: [
    BucketListsService
  ]
})
export class BucketListsModule { }
