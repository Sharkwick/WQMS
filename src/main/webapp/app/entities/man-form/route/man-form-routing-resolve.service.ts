import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IManForm } from '../man-form.model';
import { ManFormService } from '../service/man-form.service';

@Injectable({ providedIn: 'root' })
export class ManFormRoutingResolveService implements Resolve<IManForm | null> {
  constructor(protected service: ManFormService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IManForm | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((manForm: HttpResponse<IManForm>) => {
          if (manForm.body) {
            return of(manForm.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
