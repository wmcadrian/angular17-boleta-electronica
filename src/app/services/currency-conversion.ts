import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConversionService {
  convertir(montoPEN: number, tasa: number): number {
    return Math.round(montoPEN * tasa * 100) / 100;
  }
}
