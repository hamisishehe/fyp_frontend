import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { InstructorData } from '../../../Models/InstructorModel';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartmentModel } from '../../../Models/departmentModel';

@Component({
  selector: 'app-users',
  imports: [CommonModule,HttpClientModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {


  isOpen = false;

  userData : UserDetails | null = null;
  users: UserDetails [] = [];
  department: DepartmentModel [] = [];
  isLoading: boolean = true;


  Coordinator_id : number = 0;
  first_name : string='';
  middle_name : string='';
  last_name : string='';
  phone_number : string='';
  email : string='';
  role : string='';
  add_department : string='';


  constructor(private http : HttpClient ){

  }


  ngOnInit() {

      setTimeout(() => {
        this.isLoading = false;
      }, 100);


    this.getProfile();
    this.GetDepartment();
    this.GetUsers();
  }


  getProfile() {
    const token = localStorage.getItem('token');

    if (token) {
      // Set the Authorization header with the Bearer token
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

            this.userData = data;
            this.Coordinator_id = this.userData.id;

            console.log(this.userData.id);
          },
          (error) => {
            console.error('Error fetching user profile', error);
          }
        );
    } else {
      console.error('No token found');
    }
  }

  Insert_User(){

    console.log("................")

    const form_data = {
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      phone_number: this.phone_number,
      email: this.email,
      department: this.add_department,
      role:this.role
    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`${environment.baseUrl}/add_user`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'User added',
            showConfirmButton: false,
            timer: 1500,
          });

          window.location.reload();

        },
        error => {

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
            timer: 1500,
          });


        }
      );
}



GetUsers(){

  console.log("................")

  this.http.get<UserDetails[]>(`${environment.baseUrl}/view_users`)
    .subscribe(
      response => {

        this.users = response;
        console.log(this.users);
        this.initializeTable();

      },
      error => {


        console.log(error);
      }
    );
}



  GetDepartment(){

    console.log("................")

    this.http.get<DepartmentModel[]>(`${environment.baseUrl}/departments`)
      .subscribe(
        response => {

          this.department = response;
          console.log(this.department);
          this.initializeTable();

        },
        error => {


          console.log(error);
        }
      );
  }



  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }




  initializeTable(): void {
    setTimeout(() => {
      let datatable = new DataTable('#search-table');
      console.log('Table initialized');
    }, 100);
  }

}
