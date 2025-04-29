import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetails } from '../../../Models/userModel';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-coordinator-profile',
  imports: [HttpClientModule,CommonModule,FormsModule],
  templateUrl: './coordinator-profile.component.html',
  styleUrl: './coordinator-profile.component.css'
})
export class CoordinatorProfileComponent {

  activeTab = 'profile'; // default
  userData: UserDetails | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProfile();
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


  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  changePassword() {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User is not logged in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword,
    };

    this.http.post(`${environment.baseUrl}/user/change-password`, body, { headers })
      .subscribe(
        () => {
          alert('Password changed successfully.');
          this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
        },
        (error) => {
          console.error('Error changing password', error);
          alert('Failed to change password.');
        }
      );
  }
}
