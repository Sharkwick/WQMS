import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ManFormComponent } from './list/man-form.component';
import { ManFormDetailComponent } from './detail/man-form-detail.component';
import { ManFormUpdateComponent } from './update/man-form-update.component';
import { ManFormDeleteDialogComponent } from './delete/man-form-delete-dialog.component';
import { ManFormRoutingModule } from './route/man-form-routing.module';

@NgModule({
  imports: [SharedModule, ManFormRoutingModule],
  declarations: [ManFormComponent, ManFormDetailComponent, ManFormUpdateComponent, ManFormDeleteDialogComponent],
})
export class ManFormModule {}
