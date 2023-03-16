import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../man-form.test-samples';

import { ManFormFormService } from './man-form-form.service';

describe('ManForm Form Service', () => {
  let service: ManFormFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManFormFormService);
  });

  describe('Service methods', () => {
    describe('createManFormFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createManFormFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            resolvetype: expect.any(Object),
            resolvedetail: expect.any(Object),
            resoldeddate: expect.any(Object),
            user: expect.any(Object),
            kioskForm: expect.any(Object),
          })
        );
      });

      it('passing IManForm should create a new form with FormGroup', () => {
        const formGroup = service.createManFormFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            resolvetype: expect.any(Object),
            resolvedetail: expect.any(Object),
            resoldeddate: expect.any(Object),
            user: expect.any(Object),
            kioskForm: expect.any(Object),
          })
        );
      });
    });

    describe('getManForm', () => {
      it('should return NewManForm for default ManForm initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createManFormFormGroup(sampleWithNewData);

        const manForm = service.getManForm(formGroup) as any;

        expect(manForm).toMatchObject(sampleWithNewData);
      });

      it('should return NewManForm for empty ManForm initial value', () => {
        const formGroup = service.createManFormFormGroup();

        const manForm = service.getManForm(formGroup) as any;

        expect(manForm).toMatchObject({});
      });

      it('should return IManForm', () => {
        const formGroup = service.createManFormFormGroup(sampleWithRequiredData);

        const manForm = service.getManForm(formGroup) as any;

        expect(manForm).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IManForm should not enable id FormControl', () => {
        const formGroup = service.createManFormFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewManForm should disable id FormControl', () => {
        const formGroup = service.createManFormFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
