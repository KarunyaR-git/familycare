import {
  Component,
  forwardRef,
  Input
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
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
    }
  ]
})
export class DateTimeComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() min: string | null = null;
  @Input() max: string | null = null;
  @Input() disabled = false;

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

  onBlur(): void {
    this.onTouched();
  }
}