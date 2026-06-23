import { Component, inject } from '@angular/core';
import { FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';

import { IgvService } from '../../../../../services/igv';
import { InvoiceService } from '../../../../../services/invoice';

@Component({
  selector: 'app-concepts',
  imports: [ReactiveFormsModule],
  templateUrl: './concepts.html',
  styles: ``,
})
export class Concepts {
  protected igvService = inject(IgvService);
  private invoiceService = inject(InvoiceService);

  get form(): FormGroup {
    return this.invoiceService.form;
  }

  get conceptos(): FormArray {
    return this.invoiceService.conceptos;
  }

  addConcepto(): void {
    this.invoiceService.addConcepto();
  }

  removeConcepto(index: number): void {
    this.invoiceService.removeConcepto(index);
  }

  formatPrecioUnitario(index: number): void {
    const control = this.conceptos.at(index).get('precioUnitario');
    if (!control) return;
    const raw = control.value;
    if (raw === null || raw === undefined || raw === '') {
      control.setValue('0.00', { emitEvent: false });
      return;
    }
    const num = parseFloat(String(raw).replace(',', '.'));
    if (isNaN(num)) {
      control.setValue('0.00', { emitEvent: false });
      return;
    }
    control.setValue(num.toFixed(2), { emitEvent: false });
  }

  submonto(index: number): string {
    const row = this.conceptos.at(index)?.value;
    if (!row) return 'S/ 0.00';
    return `S/ ${this.invoiceService.formatAmount(row.cantidad * Number(row.precioUnitario))}`;
  }

  subafectacion(index: number): string {
    const row = this.conceptos.at(index)?.value;
    if (!row) return 'S/ 0.00';
    const base = row.cantidad * Number(row.precioUnitario);
    const factor = row.igv === 'gravado' ? 0.18 : 0;
    return `S/ ${this.invoiceService.formatAmount(base * factor)}`;
  }

  subtotal(index: number): string {
    const row = this.conceptos.at(index)?.value;
    if (!row) return 'S/ 0.00';
    const base = row.cantidad * Number(row.precioUnitario);
    const factor = row.igv === 'gravado' ? 1.18 : 1;
    return `S/ ${this.invoiceService.formatAmount(base * factor)}`;
  }
}
