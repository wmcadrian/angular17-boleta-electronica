import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, tap, map } from 'rxjs/operators';

export interface ExchangeRateResponse {
  base: string;
  timestamp: string;
  rates: Record<string, number>;
}

export interface ExchangeRates {
  [key: string]: number;
  USD: number;
  EUR: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private http = inject(HttpClient);
  private baseUrl = 'https://fxapi.app/api';

  private cache$ = new BehaviorSubject<{
    rates: ExchangeRates;
    timestamp: number;
  } | null>(null);

  getRates(from: string): Observable<ExchangeRates> {
    const cached = this.cache$.value;
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return of(cached.rates);
    }

    return this.http
      .get<ExchangeRateResponse>(`${this.baseUrl}/${from}.json`)
      .pipe(
        timeout(10000),
        tap(response => {
          const rates: ExchangeRates = {
            USD: response.rates['USD'],
            EUR: response.rates['EUR'],
          };
          this.cache$.next({ rates, timestamp: Date.now() });
        }),
        map(response => ({
          USD: response.rates['USD'],
          EUR: response.rates['EUR'],
        }) as ExchangeRates),
        catchError(err => {
          if (err instanceof TimeoutError) {
            return throwError(() => new Error(
              'Tiempo de espera agotado. El servicio de tasas no respondió.',
            ));
          }
          if (err.status && err.status >= 400 && err.status < 500) {
            return throwError(() => new Error(
              `Error al consultar tasas (${err.status}). Intenta más tarde.`,
            ));
          }
          return throwError(() => new Error(
            'No se pudieron obtener las tasas de cambio. Verifica tu conexión.',
          ));
        }),
      );
  }
}
