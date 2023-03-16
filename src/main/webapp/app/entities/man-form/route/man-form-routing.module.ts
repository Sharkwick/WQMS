import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ManFormComponent } from '../list/man-form.component';
import { ManFormDetailComponent } from '../detail/man-form-detail.component';
import { ManFormUpdateComponent } from '../update/man-form-update.component';
import { ManFormRoutingResolveService } from './man-form-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const manFormRoute: Routes = [
  {
    path: '',
    component: ManFormComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ManFormDetailComponent,
    resolve: {
      manForm: ManFormRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ManFormUpdateComponent,
    resolve: {
      manForm: ManFormRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ManFormUpdateComponent,
    resolve: {
      manForm: ManFormRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(manFormRoute)],
  exports: [RouterModule],
})
export class ManFormRoutingModule {}
