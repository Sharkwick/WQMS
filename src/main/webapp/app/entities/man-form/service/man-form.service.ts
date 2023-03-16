import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IManForm, NewManForm } from '../man-form.model';

export type PartialUpdateManForm = Partial<IManForm> & Pick<IManForm, 'id'>;

type RestOf<T extends IManForm | NewManForm> = Omit<T, 'resoldeddate'> & {
  resoldeddate?: string | null;
};

export type RestManForm = RestOf<IManForm>;

export type NewRestManForm = RestOf<NewManForm>;

export type PartialUpdateRestManForm = RestOf<PartialUpdateManForm>;

export type EntityResponseType = HttpResponse<IManForm>;
export type EntityArrayResponseType = HttpResponse<IManForm[]>;

@Injectable({ providedIn: 'root' })
export class ManFormService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/man-forms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(manForm: NewManForm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(manForm);
    return this.http
      .post<RestManForm>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(manForm: IManForm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(manForm);
    return this.http
      .put<RestManForm>(`${this.resourceUrl}/${this.getManFormIdentifier(manForm)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(manForm: PartialUpdateManForm): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(manForm);
    return this.http
      .patch<RestManForm>(`${this.resourceUrl}/${this.getManFormIdentifier(manForm)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestManForm>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestManForm[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getManFormIdentifier(manForm: Pick<IManForm, 'id'>): number {
    return manForm.id;
  }

  compareManForm(o1: Pick<IManForm, 'id'> | null, o2: Pick<IManForm, 'id'> | null): boolean {
    return o1 && o2 ? this.getManFormIdentifier(o1) === this.getManFormIdentifier(o2) : o1 === o2;
  }

  addManFormToCollectionIfMissing<Type extends Pick<IManForm, 'id'>>(
    manFormCollection: Type[],
    ...manFormsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const manForms: Type[] = manFormsToCheck.filter(isPresent);
    if (manForms.length > 0) {
      const manFormCollectionIdentifiers = manFormCollection.map(manFormItem => this.getManFormIdentifier(manFormItem)!);
      const manFormsToAdd = manForms.filter(manFormItem => {
        const manFormIdentifier = this.getManFormIdentifier(manFormItem);
        if (manFormCollectionIdentifiers.includes(manFormIdentifier)) {
          return false;
        }
        manFormCollectionIdentifiers.push(manFormIdentifier);
        return true;
      });
      return [...manFormsToAdd, ...manFormCollection];
    }
    return manFormCollection;
  }

  protected convertDateFromClient<T extends IManForm | NewManForm | PartialUpdateManForm>(manForm: T): RestOf<T> {
    return {
      ...manForm,
      resoldeddate: manForm.resoldeddate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restManForm: RestManForm): IManForm {
    return {
      ...restManForm,
      resoldeddate: restManForm.resoldeddate ? dayjs(restManForm.resoldeddate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestManForm>): HttpResponse<IManForm> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestManForm[]>): HttpResponse<IManForm[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
