import dayjs from 'dayjs/esm';

import { CissType } from 'app/entities/enumerations/ciss-type.model';

import { IKioskForm, NewKioskForm } from './kiosk-form.model';

export const sampleWithRequiredData: IKioskForm = {
  id: 38605,
  cfname: 'bandwidth frictionless technologies',
  clname: 'generate',
  ccinf: 18802,
  customeraddress: 'Dinar',
  issuestartdate: dayjs('2023-03-15T23:10'),
  issuetype: CissType['Nullware'],
  issueDetail: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IKioskForm = {
  id: 41643,
  cfname: 'online',
  clname: 'secured withdrawal benchmark',
  ccinf: 75527,
  customeraddress: 'Supervisor',
  issuestartdate: dayjs('2023-03-16T04:12'),
  issuetype: CissType['Other'],
  issueDetail: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IKioskForm = {
  id: 13171,
  cfname: 'FTP monitoring',
  clname: 'Reactive',
  ccinf: 90322,
  customeraddress: 'Berkshire payment orange',
  issuestartdate: dayjs('2023-03-15T06:45'),
  issuetype: CissType['Other'],
  issueDetail: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewKioskForm = {
  cfname: 'Berkshire Freeway',
  clname: 'invoice',
  ccinf: 27849,
  customeraddress: 'navigate',
  issuestartdate: dayjs('2023-03-15T09:21'),
  issuetype: CissType['Nullware'],
  issueDetail: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
