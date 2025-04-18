import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-coordinator-sidebar',
  imports: [RouterLink, RouterModule,HttpClientModule],
  templateUrl: './coordinator-sidebar.component.html',
  styleUrl: './coordinator-sidebar.component.css'
})
export class CoordinatorSidebarComponent implements OnInit{

  private inactivityTime: any;
  private readonly inactivityLimit = 300000; // 5 minutes in milliseconds

  constructor(private router: Router) {}

  ngOnInit() {
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
