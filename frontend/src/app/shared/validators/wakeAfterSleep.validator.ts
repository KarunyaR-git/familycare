import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const wakeAfterSleepValidator: ValidatorFn = (
  form: AbstractControl
): ValidationErrors | null => {
  const sleptAt = form.get('sleptAt')?.value;
  const wokeUpAt = form.get('wokeUpAt')?.value;

  if (!sleptAt || !wokeUpAt) {
    return null;
  }

  const sleptTime = new Date(sleptAt).getTime();
  const wakeTime = new Date(wokeUpAt).getTime();

  return wakeTime > sleptTime
    ? null
    : { wakeBeforeSleep: true };
};