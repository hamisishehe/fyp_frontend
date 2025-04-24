import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InstructorData } from '../../../Models/InstructorModel';
import { StudentData } from '../../../Models/StudentModel';
import { CourseData } from '../../../Models/CourseModel';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { Venue } from '../../../Models/VenueModel';
import { TimelineService } from '../timeline.service';

@Component({
  selector: 'app-t-master-dashboard',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './t-master-dashboard.component.html',
  styleUrl: './t-master-dashboard.component.css',
})
export class TMasterDashboardComponent implements OnInit {
  instructors: InstructorData [] = [];
  students: StudentData [] = [];
   course_list: CourseData [] = [];
   venue_list: Venue [] = [];

   activities: TimelineActivity[] = [];


  constructor(private http:HttpClient, private timelineService: TimelineService){}
    ngOnInit(): void {
      this.GetInstructors();
      this.GetStudents();
      this.GetCourse();
      this.GetVenue();
      this.activities = this.timelineService.getActivities();
    }

    GetInstructors(){

      console.log("................")

      this.http.get<InstructorData[]>(`${environment.baseUrl}/instructors`)
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

      this.http.get<StudentData[]>(`${environment.baseUrl}/students`)
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



    GetVenue(){

      console.log("1................")

      this.http.get<Venue[]>(`${environment.baseUrl}/venues`)
        .subscribe(
          response => {

            this.venue_list = response;
            console.log(response);

          },
          error => {

            console.log("Error  ................")
            console.log(error);
          }
        );
    }





  }

  // timeline-activity.model.ts (optional)
export interface TimelineActivity {
  path: string;
  time: Date;
}
