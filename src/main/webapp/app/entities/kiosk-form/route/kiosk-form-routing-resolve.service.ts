import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IKioskForm } from '../kiosk-form.model';
import { KioskFormService } from '../service/kiosk-form.service';

@Injectable({ providedIn: 'root' })
export class KioskFormRoutingResolveService implements Resolve<IKioskForm | null> {
  constructor(protected service: KioskFormService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IKioskForm | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((kioskForm: HttpResponse<IKioskForm>) => {
          if (kioskForm.body) {
            return of(kioskForm.body);
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
