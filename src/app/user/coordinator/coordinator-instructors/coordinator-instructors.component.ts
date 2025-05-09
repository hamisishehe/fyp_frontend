import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTable } from 'simple-datatables';
import { environment } from '../../../environments/environment';
import { UserDetails } from '../../../Models/userModel';
import Swal from 'sweetalert2'
import { InstructorData } from '../../../Models/InstructorModel';

@Component({
  selector: 'app-coordinator-instructors',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './coordinator-instructors.component.html',
  styleUrl: './coordinator-instructors.component.css'
})
export class CoordinatorInstructorsComponent implements OnInit{

  isOpen = false;

  userData : UserDetails | null = null;
  instructors: InstructorData [] = [];


  Coordinator_id : number = 0;
  first_name : string='';
  middle_name : string='';
  last_name : string='';
  phone_number : string='';
  email : string='';
  title : string='';


  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    this.getProfile();
    this.GetInstructors();
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

  Insert_NewInstructor(){

    console.log("................")

    const form_data = {
      first_name: this.first_name,
      middle_name: this.middle_name,
      last_name: this.last_name,
      phone_number: this.phone_number,
      email: this.email,
      title: this.title,
      coordinator_id: this.Coordinator_id  // make sure this is set
    };

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`http://127.0.0.1:5000/add_instructor`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Instructor added',
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



GetInstructors(){

  console.log("................")

  this.http.get<InstructorData[]>(`http://127.0.0.1:5000/instructors`)
    .subscribe(
      response => {

        this.instructors = response;
        console.log(this.instructors);
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
