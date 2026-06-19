import { Component, inject } from '@angular/core';

import { DocumentService } from '../../../../services/document';
import { InvoiceService } from '../../../../services/invoice';
import { NumberingService } from '../../../../services/numbering';

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

  protected get documentTypeLabel(): string {
    const c = this.invoiceService.clienteSnapshot();
    if (!c) return '';
    const opt = this.documentService.documentTypeOptions.find(o => o.value === c.documentType);
    return opt?.label ?? c.documentType.toUpperCase();
  }

  onConfirmarEmitir(): void {
    if (this.invoiceService.form.invalid) return;
    this.numberingService.registrarEmision();
  }
}
