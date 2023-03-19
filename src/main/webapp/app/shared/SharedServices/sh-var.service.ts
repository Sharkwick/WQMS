import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShVarService {
  AddressedQCount!: number;
  RaisedQCount!: number;
  NetQCount!: number;

  constructor() {}

  setAddQC(data: any) {
    this.AddressedQCount = data;
  }

  setRaiQC(data: any) {
    this.RaisedQCount = data;
  }

  getAddQC() {
    return this.AddressedQCount;
  }
  getRaiQC() {
    return this.RaisedQCount;
  }
  getNetQC() {
    return (this.NetQCount = this.AddressedQCount - this.RaisedQCount);
  }
}
