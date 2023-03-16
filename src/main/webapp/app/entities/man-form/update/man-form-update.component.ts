import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ManFormFormService, ManFormFormGroup } from './man-form-form.service';
import { IManForm } from '../man-form.model';
import { ManFormService } from '../service/man-form.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IKioskForm } from 'app/entities/kiosk-form/kiosk-form.model';
import { KioskFormService } from 'app/entities/kiosk-form/service/kiosk-form.service';
import { ResolveType } from 'app/entities/enumerations/resolve-type.model';

@Component({
  selector: 'jhi-man-form-update',
  templateUrl: './man-form-update.component.html',
})
export class ManFormUpdateComponent implements OnInit {
  isSaving = false;
  manForm: IManForm | null = null;
  resolveTypeValues = Object.keys(ResolveType);

  usersSharedCollection: IUser[] = [];
  kioskFormsSharedCollection: IKioskForm[] = [];

  editForm: ManFormFormGroup = this.manFormFormService.createManFormFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected manFormService: ManFormService,
    protected manFormFormService: ManFormFormService,
    protected userService: UserService,
    protected kioskFormService: KioskFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareKioskForm = (o1: IKioskForm | null, o2: IKioskForm | null): boolean => this.kioskFormService.compareKioskForm(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ manForm }) => {
      this.manForm = manForm;
      if (manForm) {
        this.updateForm(manForm);
      }

      this.loadRelationshipsOptions();
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
    const manForm = this.manFormFormService.getManForm(this.editForm);
    if (manForm.id !== null) {
      this.subscribeToSaveResponse(this.manFormService.update(manForm));
    } else {
      this.subscribeToSaveResponse(this.manFormService.create(manForm));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IManForm>>): void {
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

  protected updateForm(manForm: IManForm): void {
    this.manForm = manForm;
    this.manFormFormService.resetForm(this.editForm, manForm);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, manForm.user);
    this.kioskFormsSharedCollection = this.kioskFormService.addKioskFormToCollectionIfMissing<IKioskForm>(
      this.kioskFormsSharedCollection,
      manForm.kioskForm
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.manForm?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.kioskFormService
      .query()
      .pipe(map((res: HttpResponse<IKioskForm[]>) => res.body ?? []))
      .pipe(
        map((kioskForms: IKioskForm[]) =>
          this.kioskFormService.addKioskFormToCollectionIfMissing<IKioskForm>(kioskForms, this.manForm?.kioskForm)
        )
      )
      .subscribe((kioskForms: IKioskForm[]) => (this.kioskFormsSharedCollection = kioskForms));
  }
}
