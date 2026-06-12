import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

interface DocumentRule {
  minLength: number;
  maxLength: number;
  pattern: RegExp;
  message: string;
}

const rules: Record<string, DocumentRule> = {
  dni: {
    minLength: 8,
    maxLength: 8,
    pattern: /^\d{8}$/,
    message: 'DNI debe tener exactamente 8 dígitos',
  },
  ruc: {
    minLength: 12,
    maxLength: 12,
    pattern: /^\d{12}$/,
    message: 'RUC debe tener exactamente 12 dígitos',
  },
  ce: {
    minLength: 10,
    maxLength: 10,
    pattern: /^\d{10}$/,
    message: 'CE debe tener exactamente 10 dígitos',
  },
  pasaporte: {
    minLength: 6,
    maxLength: 12,
    pattern: /^[a-zA-Z0-9]{6,12}$/,
    message: 'Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos',
  },
};

export function getMaxLength(documentType: string): number {
  return rules[documentType]?.maxLength ?? 999;
}

export function documentNumberValidator(documentType: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }

    const cleaned = value.trim();
    const rule = rules[documentType];

    if (!rule) {
      return null;
    }

    if (cleaned.length < rule.minLength || cleaned.length > rule.maxLength) {
      return {
        documentLength: {
          required: rule.minLength,
          max: rule.maxLength,
          message: rule.message,
        },
      };
    }

    if (!rule.pattern.test(cleaned)) {
      return {
        documentPattern: {
          message: rule.message,
        },
      };
    }

    return null;
  };
}

export function getDocumentErrorMessage(errors: ValidationErrors | null): string {
  if (!errors) return '';

  if (errors['required']) return 'El número de documento es obligatorio';
  if (errors['documentLength']) return errors['documentLength'].message;
  if (errors['documentPattern']) return errors['documentPattern'].message;

  return 'Número de documento inválido';
}
