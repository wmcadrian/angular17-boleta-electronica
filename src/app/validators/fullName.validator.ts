import { AbstractControl, ValidatorFn } from "@angular/forms";

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value?.trim() ?? '';

    const words = value.split(/\s+/);

    return words.length >= 2
      ? null
      : { fullName: true };
  };
}

export function getFullNameErrorMessage(errors: any): string {
  if (errors['required']) return 'El nombre completo es obligatorio';
  if (errors['fullName']) return 'El nombre completo debe contener al menos dos palabras';
  return '';
}