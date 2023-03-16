import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IKioskForm, NewKioskForm } from '../kiosk-form.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IKioskForm for edit and NewKioskFormFormGroupInput for create.
 */
type KioskFormFormGroupInput = IKioskForm | PartialWithRequiredKeyOf<NewKioskForm>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IKioskForm | NewKioskForm> = Omit<T, 'issuestartdate'> & {
  issuestartdate?: string | null;
};

type KioskFormFormRawValue = FormValueOf<IKioskForm>;

type NewKioskFormFormRawValue = FormValueOf<NewKioskForm>;

type KioskFormFormDefaults = Pick<NewKioskForm, 'id' | 'issuestartdate'>;

type KioskFormFormGroupContent = {
  id: FormControl<KioskFormFormRawValue['id'] | NewKioskForm['id']>;
  cfname: FormControl<KioskFormFormRawValue['cfname']>;
  clname: FormControl<KioskFormFormRawValue['clname']>;
  ccinf: FormControl<KioskFormFormRawValue['ccinf']>;
  customeraddress: FormControl<KioskFormFormRawValue['customeraddress']>;
  issuestartdate: FormControl<KioskFormFormRawValue['issuestartdate']>;
  issuetype: FormControl<KioskFormFormRawValue['issuetype']>;
  issueDetail: FormControl<KioskFormFormRawValue['issueDetail']>;
};

export type KioskFormFormGroup = FormGroup<KioskFormFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class KioskFormFormService {
  createKioskFormFormGroup(kioskForm: KioskFormFormGroupInput = { id: null }): KioskFormFormGroup {
    const kioskFormRawValue = this.convertKioskFormToKioskFormRawValue({
      ...this.getFormDefaults(),
      ...kioskForm,
    });
    return new FormGroup<KioskFormFormGroupContent>({
      id: new FormControl(
        { value: kioskFormRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      cfname: new FormControl(kioskFormRawValue.cfname, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      clname: new FormControl(kioskFormRawValue.clname, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      ccinf: new FormControl(kioskFormRawValue.ccinf, {
        validators: [Validators.required, Validators.minLength(10)],
      }),
      customeraddress: new FormControl(kioskFormRawValue.customeraddress, {
        validators: [Validators.required],
      }),
      issuestartdate: new FormControl(kioskFormRawValue.issuestartdate, {
        validators: [Validators.required],
      }),
      issuetype: new FormControl(kioskFormRawValue.issuetype, {
        validators: [Validators.required],
      }),
      issueDetail: new FormControl(kioskFormRawValue.issueDetail, {
        validators: [Validators.required],
      }),
    });
  }

  getKioskForm(form: KioskFormFormGroup): IKioskForm | NewKioskForm {
    return this.convertKioskFormRawValueToKioskForm(form.getRawValue() as KioskFormFormRawValue | NewKioskFormFormRawValue);
  }

  resetForm(form: KioskFormFormGroup, kioskForm: KioskFormFormGroupInput): void {
    const kioskFormRawValue = this.convertKioskFormToKioskFormRawValue({ ...this.getFormDefaults(), ...kioskForm });
    form.reset(
      {
        ...kioskFormRawValue,
        id: { value: kioskFormRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): KioskFormFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      issuestartdate: currentTime,
    };
  }

  private convertKioskFormRawValueToKioskForm(rawKioskForm: KioskFormFormRawValue | NewKioskFormFormRawValue): IKioskForm | NewKioskForm {
    return {
      ...rawKioskForm,
      issuestartdate: dayjs(rawKioskForm.issuestartdate, DATE_TIME_FORMAT),
    };
  }

  private convertKioskFormToKioskFormRawValue(
    kioskForm: IKioskForm | (Partial<NewKioskForm> & KioskFormFormDefaults)
  ): KioskFormFormRawValue | PartialWithRequiredKeyOf<NewKioskFormFormRawValue> {
    return {
      ...kioskForm,
      issuestartdate: kioskForm.issuestartdate ? kioskForm.issuestartdate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
