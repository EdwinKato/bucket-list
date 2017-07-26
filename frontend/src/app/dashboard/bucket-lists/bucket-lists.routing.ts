import { Routes, RouterModule } from '@angular/router';

import { BucketListsComponent } from './bucket-lists.component';
import { BucketListDetailComponent } from './bucket-list-detail.component';
import { BucketListFormComponent } from "./bucket-list-form/bucket-list-form.component";

const bucketListRoutes: Routes = [
  { path: 'bucket-lists', component: BucketListsComponent, pathMatch: 'full' },
  { path: 'bucket-lists/new', component: BucketListFormComponent},
  { path: 'bucket-list-detail', component: BucketListDetailComponent },
  { path: 'bucket-lists/:id', component: BucketListFormComponent}
];

export const bucketListRouting = RouterModule.forChild(bucketListRoutes);
