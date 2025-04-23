import { Component } from '@angular/core';
import { UserDetails } from '../../../Models/userModel';
import { CourseData } from '../../../Models/CourseModel';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DataTable } from 'simple-datatables';
import { InstructorData } from '../../../Models/InstructorModel';
import { StudentData } from '../../../Models/StudentModel';
import { NgSelectModule } from '@ng-select/ng-select';
import Swal from 'sweetalert2';
import { CourseMatrixView } from '../../../Models/CourseAssignModel';


@Component({
  selector: 'app-coordinator-assign-course',
  imports: [CommonModule,FormsModule,HttpClientModule,NgSelectModule],
  templateUrl: './coordinator-assign-course.component.html',
  styleUrl: './coordinator-assign-course.component.css'
})
export class CoordinatorAssignCourseComponent {

  isOpen = false;
  isLoading: boolean = true;
  userData : UserDetails | null = null;


  course_list: CourseData [] = [];
  instructors: InstructorData [] = [];
  students: StudentData [] = [];



  asignCourseResult: CourseMatrixView [] = [];


  Coordinator_id : number = 0;
  course_id : number = 0;
  student_id: number[] = [];
  instructor_id: number = 0;


  constructor(private http : HttpClient ){


  }



  ngOnInit() {

    this.getProfile();
    this.GetCourse();
    this.GetInstructors();
    this.GetStudents();
    this.GetAssignedCourse();

  }



  AssignCourse(){

      console.log("................")

        const form_data = {
          instructor_id: this.instructor_id,
          course_id: this.course_id,
          student_id: this.student_id,
        };

        const headers = { 'Content-Type': 'application/json' };


        this.http.post<any>(`${environment.baseUrl}/assign-course`, form_data,  { headers })
          .subscribe(
            response => {

              if (response.message === "Course Already Assigned") {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Course Already Assigned",
                  timer: 1500,
                  showConfirmButton: false
                });

                console.log(response);
              }
              else{
                Swal.fire({
                  icon: 'success',
                  title: 'Course Assigned',
                  showConfirmButton: false,
                  timer: 1500,
                });

                console.log(response);

              }





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



GetCourse(){

  console.log("1................")

  this.http.get<CourseData[]>(`${environment.baseUrl}/course_list`)
    .subscribe(
      response => {

        this.course_list = response.map(item => ({
          ...item,
          displayText: `${item.course_name} ${item.course_code}`
        }));

      },
      error => {

        console.log("Error  ................")
        console.log(error);
      }
    );
}

GetInstructors(){

  console.log("................")

  this.http.get<InstructorData[]>(`${environment.baseUrl}/instructors`)
    .subscribe(
      response => {

        this.instructors = response.map(item => ({
          ...item,
          displayText: `${item.first_name} ${item.last_name}`
        }));

     this.initializeTable();
      },
      error => {


        console.log(error);
      }
    );
}


GetStudents(){

  console.log("................")

  this.http.get<StudentData[]>(`${environment.baseUrl}/students`)
    .subscribe(
      response => {

        this.students = response.map(item => ({
          ...item,
          displayText: `${item.programme}`
        }));

      },
      error => {


        console.log(error);
      }
    );
}



GetAssignedCourse() {
  this.http.get<CourseMatrixView[]>(`${environment.baseUrl}/view/course-matrix`)
    .subscribe(
      response => {
        const grouped: { [key: string]: any } = {};

        response.forEach(item => {
          const key = `${item.course.id}_${item.instructor.id}`;
          if (!grouped[key]) {
            grouped[key] = {
              course_matrix_id: item.course_matrix_id,
              course: item.course,
              instructor: item.instructor,
              students: [item.student.programme]
            };
          } else {
            grouped[key].students.push(item.student.programme);
          }
        });

        this.asignCourseResult = Object.values(grouped).map((entry: any) => ({
          ...entry,
          studentProgrammes: entry.students.join(", ")
        }));

        this.initializeTable();
      },
      error => {
        console.error(error);
      }
    );
}


  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  trackById = (index: number, item: any): number => {
    return item?.id ?? index;  // Use optional chaining to prevent crash
  };






  initializeTable(): void {
    setTimeout(() => {
      let datatable = new DataTable('#search-table');
      console.log('Table initialized');
    }, 100);
  }

}
