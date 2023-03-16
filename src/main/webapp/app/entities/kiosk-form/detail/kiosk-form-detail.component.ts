import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IKioskForm } from '../kiosk-form.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-kiosk-form-detail',
  templateUrl: './kiosk-form-detail.component.html',
})
export class KioskFormDetailComponent implements OnInit {
  kioskForm: IKioskForm | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ kioskForm }) => {
      this.kioskForm = kioskForm;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
