import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKioskForm, NewKioskForm } from '../kiosk-form.model';

export type PartialUpdateKioskForm = Partial<IKioskForm> & Pick<IKioskForm, 'id'>;

type RestOf<T extends IKioskForm | NewKioskForm> = Omit<T, 'issuestartdate'> & {
  issuestartdate?: string | null;
};

export type RestKioskForm = RestOf<IKioskForm>;

export type NewRestKioskForm = RestOf<NewKioskForm>;

export type PartialUpdateRestKioskForm = RestOf<PartialUpdateKioskForm>;

export type EntityResponseType = HttpResponse<IKioskForm>;
export type EntityArrayResponseType = HttpResponse<IKioskForm[]>;

@Injectable({ providedIn: 'root' })
export class KioskFormService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/kiosk-forms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(kioskForm: NewKioskForm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kioskForm);
    return this.http
      .post<RestKioskForm>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(kioskForm: IKioskForm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kioskForm);
    return this.http
      .put<RestKioskForm>(`${this.resourceUrl}/${this.getKioskFormIdentifier(kioskForm)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(kioskForm: PartialUpdateKioskForm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(kioskForm);
    return this.http
      .patch<RestKioskForm>(`${this.resourceUrl}/${this.getKioskFormIdentifier(kioskForm)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestKioskForm>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestKioskForm[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getKioskFormIdentifier(kioskForm: Pick<IKioskForm, 'id'>): number {
    return kioskForm.id;
  }

  compareKioskForm(o1: Pick<IKioskForm, 'id'> | null, o2: Pick<IKioskForm, 'id'> | null): boolean {
    return o1 && o2 ? this.getKioskFormIdentifier(o1) === this.getKioskFormIdentifier(o2) : o1 === o2;
  }

  addKioskFormToCollectionIfMissing<Type extends Pick<IKioskForm, 'id'>>(
    kioskFormCollection: Type[],
    ...kioskFormsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const kioskForms: Type[] = kioskFormsToCheck.filter(isPresent);
    if (kioskForms.length > 0) {
      const kioskFormCollectionIdentifiers = kioskFormCollection.map(kioskFormItem => this.getKioskFormIdentifier(kioskFormItem)!);
      const kioskFormsToAdd = kioskForms.filter(kioskFormItem => {
        const kioskFormIdentifier = this.getKioskFormIdentifier(kioskFormItem);
        if (kioskFormCollectionIdentifiers.includes(kioskFormIdentifier)) {
          return false;
        }
        kioskFormCollectionIdentifiers.push(kioskFormIdentifier);
        return true;
      });
      return [...kioskFormsToAdd, ...kioskFormCollection];
    }
    return kioskFormCollection;
  }

  protected convertDateFromClient<T extends IKioskForm | NewKioskForm | PartialUpdateKioskForm>(kioskForm: T): RestOf<T> {
    return {
      ...kioskForm,
      issuestartdate: kioskForm.issuestartdate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restKioskForm: RestKioskForm): IKioskForm {
    return {
      ...restKioskForm,
      issuestartdate: restKioskForm.issuestartdate ? dayjs(restKioskForm.issuestartdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestKioskForm>): HttpResponse<IKioskForm> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestKioskForm[]>): HttpResponse<IKioskForm[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
