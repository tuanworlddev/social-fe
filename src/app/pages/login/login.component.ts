import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading: boolean = false;
  errorMessage = signal('');

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

  getEmail() {
    return this.loginForm.get('email');
  }

  getPassword() {
    return this.loginForm.get('password');
  }

  closeModalError() {
    this.errorMessage.set('');
  }

  onLogin() {
    if (this.loginForm.valid) {
      const email = this.getEmail()?.value;
      const password = this.getPassword()?.value;

      this.isLoading = true;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.authService.login(email, password).subscribe((response) => {
            this.authService.saveToken(response.data.token);
            this.authService.saveRefreshToken(response.data.refreshToken);
            this.router.navigate(['/']);
          });
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.errorMessage.set('Login failed. Please try again.');
        }
      });
    } else {
      this.errorMessage.set('Please enter data');
    }
  }

}
