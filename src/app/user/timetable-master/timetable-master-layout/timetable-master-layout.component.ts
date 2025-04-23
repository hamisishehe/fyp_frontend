import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TMasterSidebarComponent } from '../t-master-sidebar/t-master-sidebar.component';
import { TMasterFooterComponent } from '../t-master-footer/t-master-footer.component';
import { TMasterHeaderComponent } from '../t-master-header/t-master-header.component';

@Component({
  selector: 'app-timetable-master-layout',
  imports: [
    RouterOutlet,
    HttpClientModule,
    TMasterSidebarComponent,
    TMasterHeaderComponent,
  ],
  templateUrl: './timetable-master-layout.component.html',
  styleUrl: './timetable-master-layout.component.css',
})
export class TimetableMasterLayoutComponent {
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
