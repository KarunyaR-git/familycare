import { AbstractControl, ValidationErrors } from '@angular/forms';

export function onlyValidUnitValidator(
  control: AbstractControl
): ValidationErrors | null {
    const unit = control.value;
    if (!["ml", "oz"].includes(unit)) {
        return {
            invalidUnit: true
        };
    }
    return null;
}