import dayjs from 'dayjs/esm';
import { CissType } from 'app/entities/enumerations/ciss-type.model';

export interface IKioskForm {
  id: number;
  cfname?: string | null;
  clname?: string | null;
  ccinf?: number | null;
  customeraddress?: string | null;
  issuestartdate?: dayjs.Dayjs | null;
  issuetype?: CissType | null;
  issueDetail?: string | null;
}

export type NewKioskForm = Omit<IKioskForm, 'id'> & { id: null };
