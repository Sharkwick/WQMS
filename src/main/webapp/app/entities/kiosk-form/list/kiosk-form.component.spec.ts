import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { KioskFormService } from '../service/kiosk-form.service';

import { KioskFormComponent } from './kiosk-form.component';

describe('KioskForm Management Component', () => {
  let comp: KioskFormComponent;
  let fixture: ComponentFixture<KioskFormComponent>;
  let service: KioskFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'kiosk-form', component: KioskFormComponent }]), HttpClientTestingModule],
      declarations: [KioskFormComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(KioskFormComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KioskFormComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(KioskFormService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.kioskForms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to kioskFormService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getKioskFormIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getKioskFormIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
