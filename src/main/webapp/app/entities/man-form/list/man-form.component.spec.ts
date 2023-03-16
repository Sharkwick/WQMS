import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ManFormService } from '../service/man-form.service';

import { ManFormComponent } from './man-form.component';

describe('ManForm Management Component', () => {
  let comp: ManFormComponent;
  let fixture: ComponentFixture<ManFormComponent>;
  let service: ManFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'man-form', component: ManFormComponent }]), HttpClientTestingModule],
      declarations: [ManFormComponent],
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
      .overrideTemplate(ManFormComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ManFormComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ManFormService);

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
    expect(comp.manForms?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to manFormService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getManFormIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getManFormIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
