import { Component, inject } from '@angular/core';

import { DocumentService } from '../../../../services/document';
import { InvoiceService } from '../../../../services/invoice';
import { NumberingService } from '../../../../services/numbering';
import { CurrencyConversionService } from '../../../../services/currency-conversion';

@Component({
  selector: 'app-summary',
  imports: [],
  templateUrl: './summary.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class Summary {
  private numberingService = inject(NumberingService);
  protected invoiceService = inject(InvoiceService);
  protected documentService = inject(DocumentService);
  private currencyConversion = inject(CurrencyConversionService);

  protected get documentTypeLabel(): string {
    const c = this.invoiceService.clienteSnapshot();
    if (!c) return '';
    const opt = this.documentService.documentTypeOptions.find(o => o.value === c.documentType);
    return opt?.label ?? c.documentType.toUpperCase();
  }

  protected convertir(monto: number): number {
    const tasa = this.invoiceService.tasasCambio()?.[this.invoiceService.divisaActiva()];
    if (!tasa) return monto;
    return this.currencyConversion.convertir(monto, tasa);
  }

  protected mostrarEnDivisa(monto: number): string {
    const divisa = this.invoiceService.divisaActiva();
    const tasas = this.invoiceService.tasasCambio();
    if (divisa === 'PEN' || !tasas?.[divisa]) {
      return `PEN S/ ${this.invoiceService.formatAmount(monto)}`;
    }
    const convertido = this.convertir(monto);
    return `${divisa} S/ ${this.invoiceService.formatAmount(convertido)}`;
  }

  onConfirmarEmitir(): void {
    if (this.invoiceService.form.invalid) return;
    this.numberingService.registrarEmision();
  }
}
