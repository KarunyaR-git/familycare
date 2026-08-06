import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input-component/input-component';
import { ButtonComponent } from '../../../shared/components/button-component/button-component';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { emailValidator } from '../../../shared/validators/email.validator';

@Component({
  selector: 'login-component',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm;
  isLoading = signal(false);
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator]],
      password: ['', [Validators.required]]
    });
    
  }
  onSubmit() {
    if(this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.login).subscribe({
        next:(response)=>{
          this.isLoading.set(false);
          this.authService.saveToken(response.token)
          this.router.navigate(['/home']);
        },
        error:(error)=>{
          this.isLoading.set(false);
          console.log(error);
        }
      });
      
    }
  }
  get isDisabled() {
    return !this.loginForm.valid || this.isLoading();
  }

  get login() {
    const form = this.loginForm as FormGroup;
    return form.value;
  }
}
