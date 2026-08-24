import {
  Component,
  forwardRef,
  Input
} from '@angular/core';

import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Component({
  selector: 'app-date-time-component',
  imports: [],
  templateUrl: './date-time-component.html',
  styleUrl: './date-time-component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true
    }
  ]
})
export class DateTimeComponent implements ControlValueAccessor, Validator {

  @Input() label = '';
  @Input() min: string | null = null;
  @Input() max: string | null = null;
  @Input() disabled = false;
  @Input() required = false;
  @Input() type: 'date' | 'datetime-local' = 'datetime-local';
  @Input() errorMessage = '';
  @Input() blockFuture = false;

  value = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.value = value;
    this.onChange(value);
  }

  private isFutureValue(value: string): boolean {
    if (!value) {
      return false;
    }

    if (this.type === 'date') {
      const today = this.getLocalDate(new Date());

      return value > today;
    }

    return new Date(value).getTime() > Date.now();
  }

  private getLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  onBlur(): void {
    this.onTouched();
  }

  get maxValue(): string | null {
    if (!this.blockFuture) {
      return this.max;
    }

    const now = new Date();

    if (this.type === 'date') {
      return this.getLocalDate(now);
    }

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.blockFuture || !control.value) {
      return null;
    }

    const value = control.value;

    if (this.type === 'date') {
      const today = this.getLocalDate(new Date());

      return value > today
        ? { futureDate: true }
        : null;
    }

    return new Date(value).getTime() > Date.now()
      ? { futureDate: true }
      : null;
  }
}