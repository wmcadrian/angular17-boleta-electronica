import { Component, inject, signal } from '@angular/core';
import { JsonPipe, AsyncPipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';

import { Information } from "./information/information";
import { Concepts } from './concepts/concepts';
import { History } from '../history/history';
import { Modal } from '../../../../components/modal/modal';

import { InvoiceService } from '../../../../services/invoice';
import { ExchangeRateService } from '../../../../services/exchange-rate';
import { ModalService } from '../../../../services/modal';

@Component({
  selector: 'app-electronic-invoice',
  imports: [Information, Concepts, History, JsonPipe, AsyncPipe, Modal],
  templateUrl: './electronic-invoice.html',
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class ElectronicInvoice {
  protected invoiceService = inject(InvoiceService);
  private exchangeRateService = inject(ExchangeRateService);
  protected modalService = inject(ModalService);

  protected loadingTasas = signal<boolean>(false);

  async validarCalcular(): Promise<void> {
    this.invoiceService.form.markAllAsTouched();
    if (this.invoiceService.form.invalid) return;

    this.invoiceService.tomarSnapshot();

    if (this.invoiceService.divisaActiva() === 'PEN') return;

    this.loadingTasas.set(true);

    try {
      const rates = await lastValueFrom(
        this.exchangeRateService.getRates('PEN')
      );
      this.invoiceService.tasasCambio.set(rates);
      this.modalService.mostrar({
        tipo: 'exito',
        titulo: 'Conversión realizada',
        mensaje: 'Las tasas de cambio se obtuvieron correctamente.',
      });
    } catch (e) {
      this.invoiceService.tasasCambio.set(null);
      this.modalService.mostrar({
        tipo: 'error',
        titulo: 'Error de conversión',
        mensaje: e instanceof Error ? e.message : 'Error inesperado',
      });
    } finally {
      this.loadingTasas.set(false);
    }
  }
}
