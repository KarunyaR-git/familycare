import { Component, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-component',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true
    }
  ],
  templateUrl: './input-component.html',
  styleUrl: './input-component.css',
})
export class InputComponent implements ControlValueAccessor{
 
  @Input() label = '';

  @Input() placeholder = '';

  @Input() type = 'text';

  @Input() required = false;

  @Input() errorMessage = '';

  value:any = '';
  registerChange: (value: any) => void = () => {};
  registerTouched: () => void = () => {};
  disabled= false;
  hidePassword = signal(true);

  onValueChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.registerChange(this.value);

  }
  onBlur(): void {
    this.registerTouched();
  }
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: (value: any) => void): void {
    this.registerChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.registerTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  togglePassword(): void {
    this.hidePassword.set(!this.hidePassword());
  }
}
