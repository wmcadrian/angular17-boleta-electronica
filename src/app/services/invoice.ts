import { Injectable, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

import { documentNumberValidator } from '../validators/document.validator';
import { fullNameValidator } from '../validators/fullName.validator';
import { minLengthArray } from '../validators/array.validator';
import { ExchangeRates } from './exchange-rate';

export interface ClienteSnapshot {
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
}

export interface TotalesSnapshot {
  subtotal: number;
  subafectacion: number;
  totalGeneral: number;
}

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private fb = inject(FormBuilder);

  form: FormGroup = this.buildForm();

  readonly clienteSnapshot = signal<ClienteSnapshot | null>(null);
  readonly totalesSnapshot = signal<TotalesSnapshot | null>(null);

  readonly divisaActiva = signal<string>('PEN');
  readonly tasasCambio = signal<ExchangeRates | null>(null);

  get cliente(): FormGroup {
    return this.form.get('cliente') as FormGroup;
  }

  get conceptos(): FormArray {
    return this.form.get('conceptos') as FormArray;
  }

  formatAmount(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  simboloDivisa(divisa: string): string {
    const map: Record<string, string> = { PEN: 'S/', USD: '$', EUR: '€' };
    return map[divisa] ?? 'S/';
  }

  tomarSnapshot(): void {
    const c = this.cliente.value;
    this.clienteSnapshot.set({
      fullName: c.fullName ?? '',
      documentType: c.documentType ?? '',
      documentNumber: c.documentNumber ?? '',
      email: c.email ?? '',
    });

    let subtotal = 0;
    let subafectacion = 0;
    for (const ctrl of this.conceptos.controls) {
      const v = ctrl.value;
      const cantidad = Number(v.cantidad) || 0;
      const precio = Number(v.precioUnitario) || 0;
      const base = cantidad * precio;
      subtotal += base;
      if (v.igv === 'gravado') {
        subafectacion += base * 0.18;
      }
    }
    this.totalesSnapshot.set({
      subtotal: Number(subtotal.toFixed(2)),
      subafectacion: Number(subafectacion.toFixed(2)),
      totalGeneral: Number((subtotal + subafectacion).toFixed(2)),
    });
  }

  constructor() {
    this.form.get('cliente.documentType')?.valueChanges.subscribe(type => {
      const control = this.form.get('cliente.documentNumber');
      if (control) {
        control.clearValidators();
        control.setValidators([Validators.required, documentNumberValidator(type)]);
        control.updateValueAndValidity();
      }
    });
  }

  addConcepto(): void {
    this.conceptos.push(this.crearConcepto());
  }

  removeConcepto(index: number): void {
    console.log('Removing concepto at index:', index);
    this.conceptos.removeAt(index);
  }

  private buildForm(): FormGroup {
    return this.fb.group({
      cliente: this.fb.group({
        documentType: ['dni', Validators.required],
        documentNumber: ['', 
          [
            Validators.required, 
            documentNumberValidator('dni')
          ]
        ],
        fullName: ['', 
          [
            Validators.required, 
            fullNameValidator()
          ]
        ],
        email: ['', 
          [
            Validators.required, 
            Validators.email
          ]
        ],
        fechaLegal: [this.getTodayISO(), Validators.required],
        divisa: ['PEN', Validators.required],
      }),
      conceptos: this.fb.array<FormGroup>(
        [
          /* this.crearConcepto('Desarrollo Web', 40, 75),
          this.crearConcepto('Consultoría SEO', 10, 120),
          this.crearConcepto('Hosting Anual', 1, 150), */
        ],
        [minLengthArray(1)]
      ),
    });
  }

  private crearConcepto(
    descripcion = '',
    cantidad = 1,
    precioUnitario = 0,
  ): FormGroup {
    const fmt = (n: number): string => n.toFixed(2);
    return this.fb.group({
      descripcion: [descripcion, Validators.required],
      cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario: [fmt(precioUnitario), [Validators.required]],
      igv: ['exonerado', Validators.required],
    });
  }

  private getTodayISO(): string {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`; // formato permitido por input type="date"
  }
}
