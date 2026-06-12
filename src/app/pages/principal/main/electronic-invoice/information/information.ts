import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';

import { DocumentService } from '../../../../../services/document';
import { NumberingService } from '../../../../../services/numbering';

import { documentNumberValidator, getDocumentErrorMessage, getMaxLength } from '../../../../../validators/document.validator';
import { fullNameValidator, getFullNameErrorMessage } from '../../../../../validators/fullName.validator';
import { getEmailErrorMessage } from '../../../../../validators/email.validator';

@Component({
  selector: 'app-information',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './information.html',
  styles: ``,
})
export class Information implements OnInit, OnDestroy {
  private documentService = inject(DocumentService);
  protected numberingService = inject(NumberingService);
  public documentTypeOptions = this.documentService.documentTypeOptions;
  private documentTypeSubscription?: Subscription;
  private fechaSubscription?: Subscription;
  private fb = inject(FormBuilder);

  public clientForm: FormGroup = this.fb.group({
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
    email: ['', [Validators.required, Validators.email]],
    fechaLegal: [
      this.getTodayISO(), 
      Validators.required
    ],
  });

  ngOnInit() {
    this.documentTypeSubscription = this.clientForm.get('documentType')?.valueChanges.subscribe(type => {
      const control = this.clientForm.get('documentNumber');
      control?.clearValidators();
      control?.setValidators([Validators.required, documentNumberValidator(type)]);
      control?.updateValueAndValidity();
    });

    this.fechaSubscription = this.clientForm.get('fechaLegal')?.valueChanges.subscribe(fecha => {
      if (fecha) {
        this.numberingService.setFecha(fecha);
      }
    });
  }

  private getTodayISO(): string {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  get documentNumberError(): string {
    const control = this.clientForm.get('documentNumber');
    return getDocumentErrorMessage(control?.errors ?? null);
  }

  get maxDocumentLength(): number {
    return getMaxLength(this.clientForm.get('documentType')?.value);
  }

  onDocumentNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const max = this.maxDocumentLength;
    if (input.value.length > max) {
      input.value = input.value.slice(0, max);
      this.clientForm.get('documentNumber')?.setValue(input.value);
    }
  }

  get fullNameError(): string {
    const control = this.clientForm.get('fullName');
    return getFullNameErrorMessage(control?.errors ?? null);
  }

  get emailError(): string {
    const control = this.clientForm.get('email');
    return getEmailErrorMessage(control?.errors ?? null);
  }

  ngOnDestroy() {
    this.documentTypeSubscription?.unsubscribe();
    this.fechaSubscription?.unsubscribe();
  }
}
