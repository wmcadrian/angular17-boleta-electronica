import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minLengthArray(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const length = Array.isArray(value) ? value.length : 0;
    return length >= min ? null : { minLengthArray: { required: min, actual: length } };
  };
}
