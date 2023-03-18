import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IManForm, netQueries } from '../man-form.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ManFormService } from '../service/man-form.service';
import { ManFormDeleteDialogComponent } from '../delete/man-form-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { IKioskForm } from 'app/entities/kiosk-form/kiosk-form.model';
import { KioskFormService } from 'app/entities/kiosk-form/service/kiosk-form.service';

@Component({
  selector: 'jhi-man-form',
  templateUrl: './man-form.component.html',
})
export class ManFormComponent implements OnInit {
  manForms?: IManForm[];
  kioskForms?: IKioskForm[];
  NetQCount = netQueries;
  isLoading = false;

  predicate = 'id';
  ascending = true;

  constructor(
    protected manFormService: ManFormService,
    protected KioskFormService: KioskFormService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IManForm): number => this.manFormService.getManFormIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(manForm: IManForm): void {
    const modalRef = this.modalService.open(ManFormDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.manForm = manForm;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.manForms = this.refineData(dataFromBody);
    this.kioskForms = this.refineData2(dataFromBody);
    this.NetQCount = this.kioskForms.length - this.manForms.length;
    //     let NetQCount: number => (this.refineData(dataFromBody) - this.refineData2(dataFromBody));
  }

  protected refineData(data: IManForm[]): IManForm[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected refineData2(data: IKioskForm[]): IKioskForm[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IManForm[] | null): IManForm[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.manFormService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
