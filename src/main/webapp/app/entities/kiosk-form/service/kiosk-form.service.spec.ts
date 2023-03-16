import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKioskForm } from '../kiosk-form.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../kiosk-form.test-samples';

import { KioskFormService, RestKioskForm } from './kiosk-form.service';

const requireRestSample: RestKioskForm = {
  ...sampleWithRequiredData,
  issuestartdate: sampleWithRequiredData.issuestartdate?.toJSON(),
};

describe('KioskForm Service', () => {
  let service: KioskFormService;
  let httpMock: HttpTestingController;
  let expectedResult: IKioskForm | IKioskForm[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KioskFormService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a KioskForm', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const kioskForm = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(kioskForm).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a KioskForm', () => {
      const kioskForm = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(kioskForm).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a KioskForm', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of KioskForm', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a KioskForm', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addKioskFormToCollectionIfMissing', () => {
      it('should add a KioskForm to an empty array', () => {
        const kioskForm: IKioskForm = sampleWithRequiredData;
        expectedResult = service.addKioskFormToCollectionIfMissing([], kioskForm);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kioskForm);
      });

      it('should not add a KioskForm to an array that contains it', () => {
        const kioskForm: IKioskForm = sampleWithRequiredData;
        const kioskFormCollection: IKioskForm[] = [
          {
            ...kioskForm,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addKioskFormToCollectionIfMissing(kioskFormCollection, kioskForm);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a KioskForm to an array that doesn't contain it", () => {
        const kioskForm: IKioskForm = sampleWithRequiredData;
        const kioskFormCollection: IKioskForm[] = [sampleWithPartialData];
        expectedResult = service.addKioskFormToCollectionIfMissing(kioskFormCollection, kioskForm);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kioskForm);
      });

      it('should add only unique KioskForm to an array', () => {
        const kioskFormArray: IKioskForm[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const kioskFormCollection: IKioskForm[] = [sampleWithRequiredData];
        expectedResult = service.addKioskFormToCollectionIfMissing(kioskFormCollection, ...kioskFormArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const kioskForm: IKioskForm = sampleWithRequiredData;
        const kioskForm2: IKioskForm = sampleWithPartialData;
        expectedResult = service.addKioskFormToCollectionIfMissing([], kioskForm, kioskForm2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(kioskForm);
        expect(expectedResult).toContain(kioskForm2);
      });

      it('should accept null and undefined values', () => {
        const kioskForm: IKioskForm = sampleWithRequiredData;
        expectedResult = service.addKioskFormToCollectionIfMissing([], null, kioskForm, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(kioskForm);
      });

      it('should return initial array if no KioskForm is added', () => {
        const kioskFormCollection: IKioskForm[] = [sampleWithRequiredData];
        expectedResult = service.addKioskFormToCollectionIfMissing(kioskFormCollection, undefined, null);
        expect(expectedResult).toEqual(kioskFormCollection);
      });
    });

    describe('compareKioskForm', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareKioskForm(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareKioskForm(entity1, entity2);
        const compareResult2 = service.compareKioskForm(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareKioskForm(entity1, entity2);
        const compareResult2 = service.compareKioskForm(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareKioskForm(entity1, entity2);
        const compareResult2 = service.compareKioskForm(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
