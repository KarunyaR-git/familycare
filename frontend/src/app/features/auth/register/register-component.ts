import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { emailValidator } from '../../../shared/validators/email.validator';
import { NotificationService } from '../../../core/services/notification-service';
import { getErrorMessage } from '../../../shared/utils/error-handler';

@Component({
  selector: 'register-component',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  registerForm;
  isLoading = signal(false);
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private notificationService: NotificationService){
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['',[Validators.required, emailValidator]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(7)]],
      age: [null, [Validators.min(0),Validators.max(120)]]
    },
    {
      validators: passwordMatchValidator
    }
    );
  }


  onSubmit() {
    if(this.registerForm.valid) {
      this.isLoading.set(true);
      const body:any = this.registerForm.value;
      body.name = body.name.trim();
      body.email = body.email.trim();
      if(body.age) {
        body.age = parseInt(body.age);
      }      
      delete body.confirmedPassword;
      this.authService.register(body).subscribe({
        next:(response) => {
          this.isLoading.set(false);
          this.notificationService.success('Registration successful');
          this.router.navigate(['/login']);
        },
        error:(error) => {
          this.isLoading.set(false);
          if (error.status === 409) {
            this.notificationService.error('Email already exists');
            return;
          }
          this.notificationService.error(getErrorMessage(error));
        }
      })
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return `${this.getFieldLabel(controlName)} is required`;
    }
    if (control.errors['emailInvalid']) {
      return 'Enter a valid email address';
    }
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }
    if (control.errors['min']) {
      return 'Age cannot be less than 0';
    }
    if (control.errors['max']) {
      return 'Age cannot be greater than 120';
    }

    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmedPassword: 'Confirm password',
      age: 'Age'
    };

    return labels[controlName] ?? controlName;
  }

  getConfirmPasswordError(): string {
    const control = this.registerForm.get('confirmedPassword');

    if (!control?.touched) {
      return '';
    }

    if (control.errors?.['required']) {
      return 'Confirm password is required';
    }

    if (control.errors?.['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `Minimum ${requiredLength} characters required`;
    }

    if (this.registerForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return '';
  }

  get isDisabled() {
    return !this.registerForm.valid || this.isLoading()
  }
}
