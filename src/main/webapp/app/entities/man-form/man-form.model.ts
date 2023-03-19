import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IKioskForm } from 'app/entities/kiosk-form/kiosk-form.model';
import { ResolveType } from 'app/entities/enumerations/resolve-type.model';
import { Type } from '@angular/core';

export interface IManForm {
  id: number;
  resolvetype?: ResolveType | null;
  resolvedetail?: string | null;
  resoldeddate?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  kioskForm?: Pick<IKioskForm, 'id' | 'ccinf'> | null;
}

export var netQueries: number;

export type NewManForm = Omit<IManForm, 'id'> & { id: null };
