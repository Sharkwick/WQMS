import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KioskFormComponent } from './list/kiosk-form.component';
import { KioskFormDetailComponent } from './detail/kiosk-form-detail.component';
import { KioskFormUpdateComponent } from './update/kiosk-form-update.component';
import { KioskFormDeleteDialogComponent } from './delete/kiosk-form-delete-dialog.component';
import { KioskFormRoutingModule } from './route/kiosk-form-routing.module';

@NgModule({
  imports: [SharedModule, KioskFormRoutingModule],
  declarations: [KioskFormComponent, KioskFormDetailComponent, KioskFormUpdateComponent, KioskFormDeleteDialogComponent],
})
export class KioskFormModule {}
