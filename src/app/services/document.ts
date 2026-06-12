import { Injectable } from '@angular/core';

interface DocumentTypeOption {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private documentType: DocumentTypeOption[] = [
    {
      value: 'dni',
      label: 'DNI'
    },
    {
      value: 'ruc',
      label: 'RUC'
    },
    {
      value: 'ce',
      label: 'CE'
    }, {
      value: 'pasaporte',
      label: 'PASAPORTE'
    }
  ];

  get documentTypeOptions(): DocumentTypeOption[] {
    return [...this.documentType];
  }
}
