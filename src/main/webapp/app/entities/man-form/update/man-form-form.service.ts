import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IManForm, NewManForm } from '../man-form.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IManForm for edit and NewManFormFormGroupInput for create.
 */
type ManFormFormGroupInput = IManForm | PartialWithRequiredKeyOf<NewManForm>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IManForm | NewManForm> = Omit<T, 'resoldeddate'> & {
  resoldeddate?: string | null;
};

type ManFormFormRawValue = FormValueOf<IManForm>;

type NewManFormFormRawValue = FormValueOf<NewManForm>;

type ManFormFormDefaults = Pick<NewManForm, 'id' | 'resoldeddate'>;

type ManFormFormGroupContent = {
  id: FormControl<ManFormFormRawValue['id'] | NewManForm['id']>;
  resolvetype: FormControl<ManFormFormRawValue['resolvetype']>;
  resolvedetail: FormControl<ManFormFormRawValue['resolvedetail']>;
  resoldeddate: FormControl<ManFormFormRawValue['resoldeddate']>;
  user: FormControl<ManFormFormRawValue['user']>;
  kioskForm: FormControl<ManFormFormRawValue['kioskForm']>;
};

export type ManFormFormGroup = FormGroup<ManFormFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ManFormFormService {
  createManFormFormGroup(manForm: ManFormFormGroupInput = { id: null }): ManFormFormGroup {
    const manFormRawValue = this.convertManFormToManFormRawValue({
      ...this.getFormDefaults(),
      ...manForm,
    });
    return new FormGroup<ManFormFormGroupContent>({
      id: new FormControl(
        { value: manFormRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      resolvetype: new FormControl(manFormRawValue.resolvetype, {
        validators: [Validators.required],
      }),
      resolvedetail: new FormControl(manFormRawValue.resolvedetail, {
        validators: [Validators.required],
      }),
      resoldeddate: new FormControl(manFormRawValue.resoldeddate, {
        validators: [Validators.required],
      }),
      user: new FormControl(manFormRawValue.user),
      kioskForm: new FormControl(manFormRawValue.kioskForm),
    });
  }

  getManForm(form: ManFormFormGroup): IManForm | NewManForm {
    return this.convertManFormRawValueToManForm(form.getRawValue() as ManFormFormRawValue | NewManFormFormRawValue);
  }

  resetForm(form: ManFormFormGroup, manForm: ManFormFormGroupInput): void {
    const manFormRawValue = this.convertManFormToManFormRawValue({ ...this.getFormDefaults(), ...manForm });
    form.reset(
      {
        ...manFormRawValue,
        id: { value: manFormRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ManFormFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      resoldeddate: currentTime,
    };
  }

  private convertManFormRawValueToManForm(rawManForm: ManFormFormRawValue | NewManFormFormRawValue): IManForm | NewManForm {
    return {
      ...rawManForm,
      resoldeddate: dayjs(rawManForm.resoldeddate, DATE_TIME_FORMAT),
    };
  }

  private convertManFormToManFormRawValue(
    manForm: IManForm | (Partial<NewManForm> & ManFormFormDefaults)
  ): ManFormFormRawValue | PartialWithRequiredKeyOf<NewManFormFormRawValue> {
    return {
      ...manForm,
      resoldeddate: manForm.resoldeddate ? manForm.resoldeddate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
