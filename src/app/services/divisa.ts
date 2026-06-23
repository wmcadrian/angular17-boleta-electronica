import { Injectable } from '@angular/core';

export interface CurrencyOption {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class DivisaService {
  private currencies: CurrencyOption[] = [
    { label: 'PEN - Soles (por defecto)', value: 'PEN' },
    { label: 'USD - Dólares', value: 'USD' },
    { label: 'EUR - Euros', value: 'EUR' },
  ];

  getCurrencies(): CurrencyOption[] {
    return [...this.currencies];
  }
}
