import { AbstractControl, ValidatorFn } from "@angular/forms";

const rule: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value?.trim() ?? '';
    return rule.test(value) ? null : { email: true };
  };
}

export function getEmailErrorMessage(errors: any): string {
  if (errors['required']) return 'El correo electrónico es obligatorio';
  if (errors['email']) return 'El correo electrónico no es válido';
  return '';
}