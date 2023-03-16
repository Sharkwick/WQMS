import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KioskFormFormService } from './kiosk-form-form.service';
import { KioskFormService } from '../service/kiosk-form.service';
import { IKioskForm } from '../kiosk-form.model';

import { KioskFormUpdateComponent } from './kiosk-form-update.component';

describe('KioskForm Management Update Component', () => {
  let comp: KioskFormUpdateComponent;
  let fixture: ComponentFixture<KioskFormUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let kioskFormFormService: KioskFormFormService;
  let kioskFormService: KioskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KioskFormUpdateComponent],
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
      .overrideTemplate(KioskFormUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KioskFormUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    kioskFormFormService = TestBed.inject(KioskFormFormService);
    kioskFormService = TestBed.inject(KioskFormService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const kioskForm: IKioskForm = { id: 456 };

      activatedRoute.data = of({ kioskForm });
      comp.ngOnInit();

      expect(comp.kioskForm).toEqual(kioskForm);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKioskForm>>();
      const kioskForm = { id: 123 };
      jest.spyOn(kioskFormFormService, 'getKioskForm').mockReturnValue(kioskForm);
      jest.spyOn(kioskFormService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kioskForm });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kioskForm }));
      saveSubject.complete();

      // THEN
      expect(kioskFormFormService.getKioskForm).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(kioskFormService.update).toHaveBeenCalledWith(expect.objectContaining(kioskForm));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKioskForm>>();
      const kioskForm = { id: 123 };
      jest.spyOn(kioskFormFormService, 'getKioskForm').mockReturnValue({ id: null });
      jest.spyOn(kioskFormService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kioskForm: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: kioskForm }));
      saveSubject.complete();

      // THEN
      expect(kioskFormFormService.getKioskForm).toHaveBeenCalled();
      expect(kioskFormService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IKioskForm>>();
      const kioskForm = { id: 123 };
      jest.spyOn(kioskFormService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ kioskForm });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(kioskFormService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
