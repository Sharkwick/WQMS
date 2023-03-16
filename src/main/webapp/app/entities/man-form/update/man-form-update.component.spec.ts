import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ManFormFormService } from './man-form-form.service';
import { ManFormService } from '../service/man-form.service';
import { IManForm } from '../man-form.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IKioskForm } from 'app/entities/kiosk-form/kiosk-form.model';
import { KioskFormService } from 'app/entities/kiosk-form/service/kiosk-form.service';

import { ManFormUpdateComponent } from './man-form-update.component';

describe('ManForm Management Update Component', () => {
  let comp: ManFormUpdateComponent;
  let fixture: ComponentFixture<ManFormUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let manFormFormService: ManFormFormService;
  let manFormService: ManFormService;
  let userService: UserService;
  let kioskFormService: KioskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ManFormUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ManFormUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ManFormUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    manFormFormService = TestBed.inject(ManFormFormService);
    manFormService = TestBed.inject(ManFormService);
    userService = TestBed.inject(UserService);
    kioskFormService = TestBed.inject(KioskFormService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const manForm: IManForm = { id: 456 };
      const user: IUser = { id: 87170 };
      manForm.user = user;

      const userCollection: IUser[] = [{ id: 43744 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ manForm });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call KioskForm query and add missing value', () => {
      const manForm: IManForm = { id: 456 };
      const kioskForm: IKioskForm = { id: 84629 };
      manForm.kioskForm = kioskForm;

      const kioskFormCollection: IKioskForm[] = [{ id: 3519 }];
      jest.spyOn(kioskFormService, 'query').mockReturnValue(of(new HttpResponse({ body: kioskFormCollection })));
      const additionalKioskForms = [kioskForm];
      const expectedCollection: IKioskForm[] = [...additionalKioskForms, ...kioskFormCollection];
      jest.spyOn(kioskFormService, 'addKioskFormToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ manForm });
      comp.ngOnInit();

      expect(kioskFormService.query).toHaveBeenCalled();
      expect(kioskFormService.addKioskFormToCollectionIfMissing).toHaveBeenCalledWith(
        kioskFormCollection,
        ...additionalKioskForms.map(expect.objectContaining)
      );
      expect(comp.kioskFormsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const manForm: IManForm = { id: 456 };
      const user: IUser = { id: 29076 };
      manForm.user = user;
      const kioskForm: IKioskForm = { id: 71573 };
      manForm.kioskForm = kioskForm;

      activatedRoute.data = of({ manForm });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.kioskFormsSharedCollection).toContain(kioskForm);
      expect(comp.manForm).toEqual(manForm);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManForm>>();
      const manForm = { id: 123 };
      jest.spyOn(manFormFormService, 'getManForm').mockReturnValue(manForm);
      jest.spyOn(manFormService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manForm });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manForm }));
      saveSubject.complete();

      // THEN
      expect(manFormFormService.getManForm).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(manFormService.update).toHaveBeenCalledWith(expect.objectContaining(manForm));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManForm>>();
      const manForm = { id: 123 };
      jest.spyOn(manFormFormService, 'getManForm').mockReturnValue({ id: null });
      jest.spyOn(manFormService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manForm: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: manForm }));
      saveSubject.complete();

      // THEN
      expect(manFormFormService.getManForm).toHaveBeenCalled();
      expect(manFormService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IManForm>>();
      const manForm = { id: 123 };
      jest.spyOn(manFormService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ manForm });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(manFormService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareKioskForm', () => {
      it('Should forward to kioskFormService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(kioskFormService, 'compareKioskForm');
        comp.compareKioskForm(entity, entity2);
        expect(kioskFormService.compareKioskForm).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
