import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../kiosk-form.test-samples';

import { KioskFormFormService } from './kiosk-form-form.service';

describe('KioskForm Form Service', () => {
  let service: KioskFormFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KioskFormFormService);
  });

  describe('Service methods', () => {
    describe('createKioskFormFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createKioskFormFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cfname: expect.any(Object),
            clname: expect.any(Object),
            ccinf: expect.any(Object),
            customeraddress: expect.any(Object),
            issuestartdate: expect.any(Object),
            issuetype: expect.any(Object),
            issueDetail: expect.any(Object),
          })
        );
      });

      it('passing IKioskForm should create a new form with FormGroup', () => {
        const formGroup = service.createKioskFormFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            cfname: expect.any(Object),
            clname: expect.any(Object),
            ccinf: expect.any(Object),
            customeraddress: expect.any(Object),
            issuestartdate: expect.any(Object),
            issuetype: expect.any(Object),
            issueDetail: expect.any(Object),
          })
        );
      });
    });

    describe('getKioskForm', () => {
      it('should return NewKioskForm for default KioskForm initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createKioskFormFormGroup(sampleWithNewData);

        const kioskForm = service.getKioskForm(formGroup) as any;

        expect(kioskForm).toMatchObject(sampleWithNewData);
      });

      it('should return NewKioskForm for empty KioskForm initial value', () => {
        const formGroup = service.createKioskFormFormGroup();

        const kioskForm = service.getKioskForm(formGroup) as any;

        expect(kioskForm).toMatchObject({});
      });

      it('should return IKioskForm', () => {
        const formGroup = service.createKioskFormFormGroup(sampleWithRequiredData);

        const kioskForm = service.getKioskForm(formGroup) as any;

        expect(kioskForm).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IKioskForm should not enable id FormControl', () => {
        const formGroup = service.createKioskFormFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewKioskForm should disable id FormControl', () => {
        const formGroup = service.createKioskFormFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
