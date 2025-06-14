import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  imports: [HttpClientModule,CommonModule,FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  academicYears: string[] = ['2024-2025', '2023-2024']; // Example academic years
  academicYear: string = '';
  semester: string = '';
  category: string = '';
  courseProgramme: string = '';
  timetable: any[] = [];
  filteredTimetable: any[] = [];
  uniqueCourses: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTimetable();
  }

  fetchTimetable() {
    // Assuming the Flask app serves the JSON file at this endpoint
    this.http.get<any[]>('http://localhost:5000/timetable_semester_1.json').subscribe(data => {
      this.timetable = data;
      this.filteredTimetable = [...this.timetable];
      this.uniqueCourses = [...new Set(this.timetable.map(item => item.course_code))];
    }, error => {
      console.error('Error fetching timetable:', error);
    });
  }

  filterTimetable() {
    this.filteredTimetable = this.timetable.filter(item => {
      const yearMatch = !this.academicYear || this.academicYear === '2024-2025'; // Adjust based on your logic
      const semesterMatch = !this.semester || item.semester.toString() === this.semester;
      const categoryMatch = !this.category || item.session_type === this.category;
      const courseMatch = !this.courseProgramme || item.course_code === this.courseProgramme;
      return yearMatch && semesterMatch && categoryMatch && courseMatch;
    });
  }

}
