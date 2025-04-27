import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../../../Models/userModel';
import { CourseData } from '../../../Models/CourseModel';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';

@Component({
  selector: 'app-coordinator-course',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './coordinator-course.component.html',
  styleUrl: './coordinator-course.component.css'
})
export class CoordinatorCourseComponent {
  isOpen = false;
  isLoading: boolean = true;
  userData : UserDetails | null = null;
  course_list: CourseData [] = [];


  Coordinator_id : number = 0;
  course_code : string='';
  course_name : string='';
  is_tutorial : string='';
  is_lecture : string='';
  time_difference : string='';
  semester : string='';


  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    this.getProfile();
    this.GetCourse();
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

  InsertNewCourse(){

    console.log("................")

    const form_data = {
      course_code: this.course_code,
      course_name: this.course_name,
      semester: this.semester,
      is_tutorial : 1,
      is_lecture : 1,
      time_difference: 3,
      coordinator_id: this.Coordinator_id  // make sure this is set
    };

    const headers = { 'Content-Type': 'application/json' };


    this.http.post(`${environment.baseUrl}/add_new_course`, form_data,  { headers })
      .subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Course added',
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



GetCourse(){

  console.log("1................")

  this.http.get<CourseData[]>(`${environment.baseUrl}/course_list`)
    .subscribe(
      response => {

        this.course_list = response;
        console.log(response);
        this.initializeTable();

      },
      error => {

        console.log("Error  ................")
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
