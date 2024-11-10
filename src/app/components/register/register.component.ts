import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {PasswordMatchValidator} from '../validators/PasswordMatchValidator';
import {User} from '../../models/User';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  errorMessage?: string;
  isLoading: boolean = false;

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.min(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.min(6)])
  }, { validators: PasswordMatchValidator() });

  constructor(private authService: AuthService) { }

  register(): void {
    this.errorMessage = undefined;
    console.log(this.registerForm);
    if (this.registerForm.valid) {
      this.isLoading = true;
      const user: User = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      }
      this.authService.register(user).subscribe(response => {
        this.isLoading = false;
        this.errorMessage = response.message;
      })
    } else {
      this.errorMessage = 'Invalid data';
    }
  }
}
