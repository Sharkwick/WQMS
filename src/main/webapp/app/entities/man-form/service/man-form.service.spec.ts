import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IManForm } from '../man-form.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../man-form.test-samples';

import { ManFormService, RestManForm } from './man-form.service';

const requireRestSample: RestManForm = {
  ...sampleWithRequiredData,
  resoldeddate: sampleWithRequiredData.resoldeddate?.toJSON(),
};

describe('ManForm Service', () => {
  let service: ManFormService;
  let httpMock: HttpTestingController;
  let expectedResult: IManForm | IManForm[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ManFormService);
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

    it('should create a ManForm', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const manForm = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(manForm).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ManForm', () => {
      const manForm = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(manForm).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ManForm', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ManForm', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ManForm', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addManFormToCollectionIfMissing', () => {
      it('should add a ManForm to an empty array', () => {
        const manForm: IManForm = sampleWithRequiredData;
        expectedResult = service.addManFormToCollectionIfMissing([], manForm);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manForm);
      });

      it('should not add a ManForm to an array that contains it', () => {
        const manForm: IManForm = sampleWithRequiredData;
        const manFormCollection: IManForm[] = [
          {
            ...manForm,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addManFormToCollectionIfMissing(manFormCollection, manForm);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ManForm to an array that doesn't contain it", () => {
        const manForm: IManForm = sampleWithRequiredData;
        const manFormCollection: IManForm[] = [sampleWithPartialData];
        expectedResult = service.addManFormToCollectionIfMissing(manFormCollection, manForm);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manForm);
      });

      it('should add only unique ManForm to an array', () => {
        const manFormArray: IManForm[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const manFormCollection: IManForm[] = [sampleWithRequiredData];
        expectedResult = service.addManFormToCollectionIfMissing(manFormCollection, ...manFormArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const manForm: IManForm = sampleWithRequiredData;
        const manForm2: IManForm = sampleWithPartialData;
        expectedResult = service.addManFormToCollectionIfMissing([], manForm, manForm2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(manForm);
        expect(expectedResult).toContain(manForm2);
      });

      it('should accept null and undefined values', () => {
        const manForm: IManForm = sampleWithRequiredData;
        expectedResult = service.addManFormToCollectionIfMissing([], null, manForm, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(manForm);
      });

      it('should return initial array if no ManForm is added', () => {
        const manFormCollection: IManForm[] = [sampleWithRequiredData];
        expectedResult = service.addManFormToCollectionIfMissing(manFormCollection, undefined, null);
        expect(expectedResult).toEqual(manFormCollection);
      });
    });

    describe('compareManForm', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareManForm(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareManForm(entity1, entity2);
        const compareResult2 = service.compareManForm(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareManForm(entity1, entity2);
        const compareResult2 = service.compareManForm(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareManForm(entity1, entity2);
        const compareResult2 = service.compareManForm(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
