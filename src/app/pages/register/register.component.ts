import { Component, signal, Signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isLoading: boolean = false;
  errorMessage = signal('');

  registerForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router) { }

  getFullName() {
    return this.registerForm.get('fullName');
  }

  getEmail() {
    return this.registerForm.get('email');
  }

  getPassword() {
    return this.registerForm.get('password');
  }

  getConfirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  closeModalError() {
    this.errorMessage.set('');
  }

  onRegister() {
    if (this.registerForm.valid) {
      const fullName = this.getFullName()?.value;
      const email = this.getEmail()?.value;
      const password = this.getPassword()?.value;
      const confirmPassword = this.getConfirmPassword()?.value;

      if (password !== confirmPassword) {
        this.getPassword()?.setValue('');
        this.getConfirmPassword()?.setValue('');
        this.errorMessage.set('Passwords do not match.');
        return;
      }

      this.isLoading = true;
      this.authService.register(email, password, fullName).subscribe({
        next: (response) => {
          this.authService.login(email, password).subscribe((response) => {
            this.authService.saveToken(response.data.token);
            this.authService.saveRefreshToken(response.data.refreshToken);
            this.router.navigate(['/']);
          });
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.errorMessage.set('Registration failed. Please try again.');
        }
      });
    } else {
      this.errorMessage.set('Please enter data');
    }
  }

}
