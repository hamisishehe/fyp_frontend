import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoginComponent } from './auth/login/login.component';
import { TimelineService } from './user/timetable-master/timeline.service';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Udom TimeTable';
  isAuthenticated: boolean = false;

  constructor(private router: Router, private timelineService: TimelineService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.timelineService.addActivity(event.urlAfterRedirects);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');

    window.location.href = '/auth/login';
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
