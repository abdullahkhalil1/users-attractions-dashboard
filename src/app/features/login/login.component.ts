import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../shared/material/material.module';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login({ ...this.loginForm.value, "expiresIn": 150000 }).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.router.navigate(['/']);
          const expirationTime = Date.now() + response.expiresIn;
          sessionStorage.setItem('token', response.accessToken);
          sessionStorage.setItem('expiresIn', expirationTime.toString());
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}
