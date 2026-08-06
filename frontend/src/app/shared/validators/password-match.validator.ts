import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmedPassword')?.value;
    if (password !== confirmPassword) {
        return {
            passwordMismatch: true
        };
    }
    return null;
}