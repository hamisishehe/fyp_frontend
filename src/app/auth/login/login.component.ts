import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  isRegistering = false;
  loading: boolean = false;

  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.loading = true;

    console.log('loading');

    // Sanitize inputs
    const sanitizedEmail = this.sanitizeInput(this.email);
    const sanitizedPassword = this.sanitizeInput(this.password);

    // Basic validation
    if (!this.validateInputs(sanitizedEmail, sanitizedPassword)) {
      this.message = 'Invalid email or password format.';
      this.loading = false;
      return;
    }

    const LoginForm = {
      email: sanitizedEmail,
      password: sanitizedPassword,
    };

    this.http
      .post<any>(
        `${environment.baseUrl}/auth/login`, // Use baseUrl from environment
        LoginForm
      )
      .subscribe(
        (response) => {
          const token = response['token'];
          const role = response['role'];

          if (
            role !== 'TIMETABLEMASTER' &&
            role !== 'ADMIN' &&
            role !== 'COORDINATOR'
          ) {
            this.message = 'Access denied.';
            this.loading = false;
            console.error('Access denied for role:', role);
            return;
          }

          if (role === 'COORDINATOR') {
            localStorage.setItem('token', token);

            window.location.href = '/user/coordinator/dashboard';
            this.loading = false;
          }

          if (role === 'ADMIN') {
            localStorage.setItem('token', token);

            window.location.href = '/user/admin/dashboard';
            this.loading = false;
          }
          if (role === 'TIMETABLEMASTER') {
            localStorage.setItem('token', token);

            console.log('login successfully');

            window.location.href = '/user/timetable-master/dashboard';
            this.loading = false;
          }
        },
        (error) => {
          this.message = 'Invalid Details';
          this.loading = false;
        }
      );
  }

  // Simple input sanitization
  private sanitizeInput(input: string): string {
    return input.trim(); // Trims whitespace
  }

  // Basic validation for email and password
  private validateInputs(email: string, password: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email pattern
    return emailPattern.test(email) && password.length >= 6; // Password must be at least 6 characters
  }
}
