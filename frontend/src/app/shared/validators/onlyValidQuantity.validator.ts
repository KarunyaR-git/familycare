import { AbstractControl, ValidationErrors } from '@angular/forms';

export function onlyValidQuantityValidator(
  form: AbstractControl
): ValidationErrors | null {
    const type = form.get('type')?.value;
    const quantity = form.get('quantity')?.value;
    const unit = form.get('unit')?.value;

    if (!quantity || !unit) {
        return null;
    }
    if ((type === 'formula' || type === 'water') && !['ml', 'oz'].includes(unit)) {
        return null;
    }
    const quantityLimits: any = {
        ml: 500,
        oz: 20,
        gram: 500,
        spoon: 20,
        piece: 20,
        serving: 10,
        other: 500
    };
    return quantity > quantityLimits[unit] ? { invalidQuantity: true } : null;
}