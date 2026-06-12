import { Injectable, signal, computed } from '@angular/core';

export interface Emision {
  numero: string;
  fecha: string;
  estado: string;
}

@Injectable({
  providedIn: 'root',
})
export class NumberingService {
  private readonly STORAGE_KEY = 'be_correlativo';
  private readonly HISTORIAL_KEY = 'be_historial';

  private seriePrefix = signal('B');
  private correlativo = signal(this.loadCorrelativo());

  readonly fecha = signal(this.formatDate(new Date()));

  readonly serieCompleta = computed(() =>
    this.seriePrefix() + String(this.correlativo()).padStart(3, '0')
  );

  readonly historial = signal<Emision[]>(this.loadHistorial());

  setFecha(isoDate: string): void {
    const [y, m, d] = isoDate.split('-');
    this.fecha.set(`${d}/${m}/${y}`);
  }

  registrarEmision(): string {
    const numero = this.serieCompleta();
    const emision: Emision = {
      numero,
      fecha: this.fecha(),
      estado: '✓ Aceptada SUNAT',
    };
    this.historial.update(list => [emision, ...list].slice(0, 5));
    this.saveHistorial();
    this.incrementar();
    return numero;
  }

  private incrementar(): void {
    const next = this.correlativo() + 1;
    this.correlativo.set(next);
    this.saveCorrelativo(next);
  }

  private loadCorrelativo(): number {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 1;
  }

  private saveCorrelativo(val: number): void {
    localStorage.setItem(this.STORAGE_KEY, String(val));
  }

  private loadHistorial(): Emision[] {
    try {
      const saved = localStorage.getItem(this.HISTORIAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveHistorial(): void {
    localStorage.setItem(this.HISTORIAL_KEY, JSON.stringify(this.historial()));
  }

  private formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
