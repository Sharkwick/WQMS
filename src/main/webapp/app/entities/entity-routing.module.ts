import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'kiosk-form',
        data: { pageTitle: 'KioskForms' },
        loadChildren: () => import('./kiosk-form/kiosk-form.module').then(m => m.KioskFormModule),
      },
      {
        path: 'man-form',
        data: { pageTitle: 'ManForms' },
        loadChildren: () => import('./man-form/man-form.module').then(m => m.ManFormModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
