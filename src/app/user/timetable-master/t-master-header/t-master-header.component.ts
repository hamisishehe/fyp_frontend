import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-t-master-header',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './t-master-header.component.html',
  styleUrl: './t-master-header.component.css',
})
export class TMasterHeaderComponent implements OnInit {

  userData: UserDetails | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProfile();
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
  }

  getProfile() {
    const token = localStorage.getItem('token');

    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Make the HTTP GET request to fetch the profile
      this.http
        .get<UserDetails>(`${environment.baseUrl}/user/profile`, {
          headers,
        }) // Use baseUrl here
        .subscribe(
          (data) => {
            this.userData = data;
            console.log(this.userData.first_name);
          },
          (error) => {
            console.error('Error fetching user profile', error);
          }
        );
    } else {
      console.error('No token found');
    }
  }
}


