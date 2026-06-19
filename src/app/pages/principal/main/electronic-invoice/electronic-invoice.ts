import { Component, inject } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { Information } from "./information/information";
import { Concepts } from './concepts/concepts';
import { History } from '../history/history';

import { InvoiceService } from '../../../../services/invoice';

@Component({
  selector: 'app-electronic-invoice',
  imports: [Information, Concepts, History, JsonPipe],
  templateUrl: './electronic-invoice.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ElectronicInvoice {
  protected invoiceService = inject(InvoiceService);

  validarCalcular(): void {
    this.invoiceService.form.markAllAsTouched();
    if (this.invoiceService.form.valid) {
      this.invoiceService.tomarSnapshot();
    }
  }
}
