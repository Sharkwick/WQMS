import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKioskForm } from '../kiosk-form.model';
import { KioskFormService } from '../service/kiosk-form.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './kiosk-form-delete-dialog.component.html',
})
export class KioskFormDeleteDialogComponent {
  kioskForm?: IKioskForm;

  constructor(protected kioskFormService: KioskFormService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.kioskFormService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
