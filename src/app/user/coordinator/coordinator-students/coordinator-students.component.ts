import { Component, OnInit } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { StudentData } from '../../../Models/StudentModel';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';

@Component({
  selector: 'app-coordinator-students',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './coordinator-students.component.html',
  styleUrl: './coordinator-students.component.css'
})
export class CoordinatorStudentsComponent implements OnInit{

  isOpen = false;
  isLoading: boolean = true;

  userData : UserDetails | null = null;
  students: StudentData [] = [];


  Coordinator_id : number = 0;
  programme : string='';
  total_students : string='';



  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    setTimeout(() => {
      this.isLoading = false;
    }, 100);

    this.getProfile();
    this.GetStudents();

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

  Insert_Student(){

    console.log("................")

    const form_data = {
      programme: this.programme,
      total_students: this.total_students,
      coordinator_id: this.Coordinator_id  // make sure this is set
    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`http://127.0.0.1:5000/add_student_program`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Student added',
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



GetStudents(){

  console.log("................")

  this.http.get<StudentData[]>(`http://127.0.0.1:5000/students`)
    .subscribe(
      response => {

        this.students = response;
        console.log(this.students);
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
