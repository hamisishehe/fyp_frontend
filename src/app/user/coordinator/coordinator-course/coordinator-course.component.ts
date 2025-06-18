import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { UserDetails } from '../../../Models/userModel';
import { CourseData } from '../../../Models/CourseModel';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { DataTable } from 'simple-datatables';
import { DepartmentModel } from '../../../Models/departmentModel';

@Component({
  selector: 'app-coordinator-course',
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './coordinator-course.component.html',
  styleUrl: './coordinator-course.component.css'
})
export class CoordinatorCourseComponent {
[x: string]: any;
  isOpen = false;
  isLoading: boolean = true;
  userData : UserDetails | null = null;
  course_list: CourseData [] = [];
   department: DepartmentModel [] = [];


  Coordinator_id : number = 0;
  course_code : string='';
  course_name : string='';
  is_tutorial : boolean = false;
  is_lecture : boolean = false;
  is_practical : boolean = false;
  semester : string='';
  department_id:number=0;



    editId: number | null = null;
    pageSize = 10;
    currentPage = 1;
    searchText = '';
    editIndex: number | null = null;




  constructor(private http : HttpClient ){

  }


  ngOnInit() {

    this.getProfile();

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
            this.GetDepartment();
            this.GetDepartmentById();
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
      is_tutorial : this.is_tutorial,
      is_lecture : this.is_lecture,
      is_practical: this.is_practical,
      coordinator_id: this.Coordinator_id,
      department_id: this.department_id  // make sure this is set
    };

    console.log(form_data);

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
            title: error,
            text: error,
            timer: 1500,
          });


        }
      );
}



GetCourse(){

  console.log("1................")

  this.http.get<CourseData[]>(`${environment.baseUrl}/courses/by-department/${this.department_id}`)
    .subscribe(
      response => {

        this.course_list = response;
        console.log(response);


      },
      error => {

        console.log("Error  ................")
        console.log(error);
      }
    );
}


GetDepartmentById(){

  console.log("................")

  this.http.get<any>(`${environment.baseUrl}/departments/${this.userData?.department}`)
    .subscribe(
      response => {

        console.log("1................")
        this.department_id = response.department_id;
        console.log(this.department_id);
        console.log("2................")

        this.GetCourse();


      },
      error => {


        console.log(error);
      }
    );
}

GetDepartment(){

  console.log("................")

  this.http.get<any>(`${environment.baseUrl}/department_id/${this.userData?.department}`)
    .subscribe(
      response => {

        console.log("1................")
        this.department_id = response.department_id;
        console.log(this.department_id);
        console.log("2................")

        this.GetCourse();


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


get filteredCourse() {
  if (!this.searchText) return this.course_list;
  return this.course_list.filter(item =>
    (item.course_name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
     item.course_code?.toLowerCase().includes(this.searchText.toLowerCase())
     )
  );
}

get paginatedVenues() {
  if (this.pageSize === this.filteredCourse.length) {
    // show all if pageSize = all
    return this.filteredCourse;
  }
  const start = (this.currentPage - 1) * this.pageSize;
  const end = start + this.pageSize;
  return this.filteredCourse.slice(start, end);
}

get totalPages() {
  return Math.ceil(this.filteredCourse.length / this.pageSize) || 1;
}

cancelEdit() {
  this.editIndex = null;
}


openUpdateModal(index: number) {
  this.editIndex = index;

}


}
