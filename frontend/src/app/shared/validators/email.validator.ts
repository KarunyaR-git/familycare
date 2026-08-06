import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: AbstractControl):ValidationErrors|null {
    const value = control.value;
    if (!value) {
        return null;
    }
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!pattern.test(value)){
        return {
            emailInvalid: true
        };
    }
    return null;
}