import dayjs from 'dayjs/esm';

import { ResolveType } from 'app/entities/enumerations/resolve-type.model';

import { IManForm, NewManForm } from './man-form.model';

export const sampleWithRequiredData: IManForm = {
  id: 89806,
  resolvetype: ResolveType['Failed'],
  resolvedetail: '../fake-data/blob/hipster.txt',
  resoldeddate: dayjs('2023-03-15T18:06'),
};

export const sampleWithPartialData: IManForm = {
  id: 27284,
  resolvetype: ResolveType['Failed'],
  resolvedetail: '../fake-data/blob/hipster.txt',
  resoldeddate: dayjs('2023-03-15T17:51'),
};

export const sampleWithFullData: IManForm = {
  id: 91489,
  resolvetype: ResolveType['Transferred'],
  resolvedetail: '../fake-data/blob/hipster.txt',
  resoldeddate: dayjs('2023-03-15T19:43'),
};

export const sampleWithNewData: NewManForm = {
  resolvetype: ResolveType['Passed'],
  resolvedetail: '../fake-data/blob/hipster.txt',
  resoldeddate: dayjs('2023-03-15T21:14'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
