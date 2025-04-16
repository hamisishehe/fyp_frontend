import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoginComponent } from './auth/login/login.component';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Udom TimeTable';
  isAuthenticated: boolean = false;

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');

    window.location.href = '/auth/login';
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
