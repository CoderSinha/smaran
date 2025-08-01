import { AbstractControl, ValidationErrors } from '@angular/forms';
import { isValidDateFormat, convertddMMyyyyToISO, isFutureOrToday } from '../utils/date.utils';

export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const dateString = control.value;

  if (!isValidDateFormat(dateString)) {
    return { invalidFormat: true };
  }

  if (!isFutureOrToday(dateString)) {
    return { pastDate: true };
  }

  return null;
}
