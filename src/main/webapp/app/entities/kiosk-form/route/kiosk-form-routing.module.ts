import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KioskFormComponent } from '../list/kiosk-form.component';
import { KioskFormDetailComponent } from '../detail/kiosk-form-detail.component';
import { KioskFormUpdateComponent } from '../update/kiosk-form-update.component';
import { KioskFormRoutingResolveService } from './kiosk-form-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const kioskFormRoute: Routes = [
  {
    path: '',
    component: KioskFormComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: KioskFormDetailComponent,
    resolve: {
      kioskForm: KioskFormRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: KioskFormUpdateComponent,
    resolve: {
      kioskForm: KioskFormRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KioskFormUpdateComponent,
    resolve: {
      kioskForm: KioskFormRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(kioskFormRoute)],
  exports: [RouterModule],
})
export class KioskFormRoutingModule {}
