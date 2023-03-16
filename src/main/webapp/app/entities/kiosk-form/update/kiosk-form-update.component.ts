import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { KioskFormFormService, KioskFormFormGroup } from './kiosk-form-form.service';
import { IKioskForm } from '../kiosk-form.model';
import { KioskFormService } from '../service/kiosk-form.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { CissType } from 'app/entities/enumerations/ciss-type.model';

@Component({
  selector: 'jhi-kiosk-form-update',
  templateUrl: './kiosk-form-update.component.html',
})
export class KioskFormUpdateComponent implements OnInit {
  isSaving = false;
  kioskForm: IKioskForm | null = null;
  cissTypeValues = Object.keys(CissType);

  editForm: KioskFormFormGroup = this.kioskFormFormService.createKioskFormFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected kioskFormService: KioskFormService,
    protected kioskFormFormService: KioskFormFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kioskForm }) => {
      this.kioskForm = kioskForm;
      if (kioskForm) {
        this.updateForm(kioskForm);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('qmsApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const kioskForm = this.kioskFormFormService.getKioskForm(this.editForm);
    if (kioskForm.id !== null) {
      this.subscribeToSaveResponse(this.kioskFormService.update(kioskForm));
    } else {
      this.subscribeToSaveResponse(this.kioskFormService.create(kioskForm));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IKioskForm>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(kioskForm: IKioskForm): void {
    this.kioskForm = kioskForm;
    this.kioskFormFormService.resetForm(this.editForm, kioskForm);
  }
}
