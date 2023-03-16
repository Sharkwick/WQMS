import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IManForm } from '../man-form.model';
import { ManFormService } from '../service/man-form.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './man-form-delete-dialog.component.html',
})
export class ManFormDeleteDialogComponent {
  manForm?: IManForm;

  constructor(protected manFormService: ManFormService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.manFormService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
