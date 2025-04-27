import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

  private inactivityTime: any;
  private readonly inactivityLimit = 1500000; // 5 minutes in milliseconds

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('loginn.......');

    this.resetInactivityTimer();
  }

  @HostListener('document:mousemove')
  @HostListener('document:keypress')
  onUserActivity() {
    this.resetInactivityTimer();
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTime);
    this.inactivityTime = setTimeout(() => {
      this.clearToken();
      window.location.href = '/auth/login';
    }, this.inactivityLimit);
  }

  private clearToken() {
    localStorage.removeItem('token'); // Clear the token from localStorage
    console.log('User inactive. Token cleared.');
  }
}