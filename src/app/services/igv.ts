import { Injectable } from '@angular/core';

interface IgvOption {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class IgvService {
  private igv: IgvOption[] = [
    {
      value: 'gravado',
      label: 'Gravado (18%)'
    },
    {
      value: 'exonerado',
      label: 'Exonerado'
    },
  ];

  get igvOptions(): IgvOption[] {
    return [...this.igv];
  }
}
