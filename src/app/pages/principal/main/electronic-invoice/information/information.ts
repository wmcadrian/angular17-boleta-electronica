import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { DocumentService } from '../../../../../services/document';
import { InvoiceService } from '../../../../../services/invoice';
import { NumberingService } from '../../../../../services/numbering';

import { getDocumentErrorMessage, getMaxLength } from '../../../../../validators/document.validator';
import { getFullNameErrorMessage } from '../../../../../validators/fullName.validator';
import { getEmailErrorMessage } from '../../../../../validators/email.validator';

@Component({
  selector: 'app-information',
  imports: [ReactiveFormsModule],
  templateUrl: './information.html',
  styles: ``,
})
export class Information implements OnInit, OnDestroy {
  private documentService = inject(DocumentService);
  private invoiceService = inject(InvoiceService);
  protected numberingService = inject(NumberingService);

  public documentTypeOptions = this.documentService.documentTypeOptions;
  private fechaSubscription?: Subscription;

  get clienteForm(): FormGroup {
    return this.invoiceService.cliente;
  }

  ngOnInit() {
    this.fechaSubscription = this.clienteForm.get('fechaLegal')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.numberingService.setFecha(fecha);
      }
    });
  }

  get documentNumberError(): string {
    const control = this.clienteForm.get('documentNumber');
    return getDocumentErrorMessage(control?.errors ?? null);
  }

  get maxDocumentLength(): number {
    return getMaxLength(this.clienteForm.get('documentType')?.value);
  }

  onDocumentNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const max = this.maxDocumentLength;
    if (input.value.length > max) {
      input.value = input.value.slice(0, max);
      this.clienteForm.get('documentNumber')?.setValue(input.value);
    }
  }

  get fullNameError(): string {
    const control = this.clienteForm.get('fullName');
    return getFullNameErrorMessage(control?.errors ?? null);
  }

  get emailError(): string {
    const control = this.clienteForm.get('email');
    return getEmailErrorMessage(control?.errors ?? null);
  }

  ngOnDestroy() {
    this.fechaSubscription?.unsubscribe();
  }
}
