import { Component, OnInit } from '@angular/core';
import { InstructorData } from '../../../Models/InstructorModel';
import { StudentData } from '../../../Models/StudentModel';
import { CourseData } from '../../../Models/CourseModel';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [HttpClientModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


instructors: InstructorData [] = [];
students: StudentData [] = [];
 course_list: CourseData [] = [];


constructor(private http:HttpClient){}
  ngOnInit(): void {
    this.GetInstructors();
    this.GetStudents();
    this.GetCourse();
  }

  GetInstructors(){

    console.log("................")

    this.http.get<InstructorData[]>(`http://127.0.0.1:5000/instructors`)
      .subscribe(
        response => {

          this.instructors = response;
          console.log(this.instructors);


        },
        error => {


          console.log(error);
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


        },
        error => {


          console.log(error);
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

        },
        error => {

          console.log("Error  ................")
          console.log(error);
        }
      );
  }






}
