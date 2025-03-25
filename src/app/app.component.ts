import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { LoginComponent } from "./auth/login/login.component";

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    initFlowbite();
  }

  title = 'frontend';
}
