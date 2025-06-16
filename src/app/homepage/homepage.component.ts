import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Session {
  day: string;
  time: string;
  course_code: string;
  course_name: string;
  groups: string[];
  instructor: string;
  venue: string;
  session_type: string;
  semester: number;
}

export interface TimetableResponse {
  status: string;
  message: string;
  generated_date: string;
  data: Session[];
}

export interface StudentData {
  id: number;
  programme: string;
  programme_code: string;
  total_students: number;
  department: any;
}

export interface DepartmentModel {
  id: number;
  name: string;
}

interface TimetableEntry {
  course_code: string;
  course_name: string;
  day: string;
  groups: string[];
  instructor: string;
  semester: number;
  session_type: string;
  time: string;
  venue: string;
}

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  timetables: TimetableEntry[] = [];
  filterType: 'group' | 'instructor' | 'venue' = 'group';
  filterValue: string = '';
  filterOptions: string[] = [];
  selectedYear: string = '2024/2025';
  selectedSemester: string = '1';
  selectedCategory: string = 'Teaching';
  academicYears: string[] = ['2023/2024', '2024/2025', '2025/2026'];
  semesters: string[] = ['1', '2'];
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots: string[] = ['07:30', '08:30', '09:30', '10:30', '11:30', '12:30', '13:30', '15:30', '17:30', '18:30'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTimetable();
  }

  fetchTimetable() {
    if (!this.selectedYear || !this.selectedSemester) {
      this.timetables = [];
      this.updateFilterOptions();
      return;
    }
    const endpoint = `http://localhost:5000/timetable_semester_${this.selectedSemester}.json`;
    this.http.get<any>(endpoint).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.timetables = response.data;
        } else if (Array.isArray(response)) {
          this.timetables = response;
        } else {
          console.error('Unexpected timetable response format:', response);
          this.timetables = [];
          return;
        }
        console.log('Fetched Timetables:', this.timetables);
        this.updateFilterOptions();
      },
      error: (error) => {
        console.error('Error fetching timetable:', error);
        if (error.status) {
          console.error('HTTP Status:', error.status);
          console.error('Error Message:', error.message);
        } else {
          console.error('Network or other error:', error);
        }
        this.timetables = [];
        this.updateFilterOptions();
      },
      complete: () => console.log('Timetable fetch completed')
    });
  }

  onYearChange() {
    this.selectedSemester = '';
    this.selectedCategory = '';
    this.filterType = 'group';
    this.filterValue = '';
    this.fetchTimetable();
  }

  onSemesterChange() {
    this.selectedCategory = '';
    this.filterType = 'group';
    this.filterValue = '';
    this.fetchTimetable();
  }

  onCategoryChange() {
    this.filterType = 'group';
    this.filterValue = '';
    this.updateFilterOptions();
  }

  onFilterTypeChange() {
    this.filterValue = '';
    this.updateFilterOptions();
  }

  updateFilterOptions() {
    let filteredTimetables = this.timetables;

    // Apply category filter
    if (this.selectedCategory && this.selectedCategory !== 'Teaching') {
      filteredTimetables = this.timetables.filter(entry => entry.session_type === this.selectedCategory);
    }

    switch (this.filterType) {
      case 'group':
        this.filterOptions = [...new Set(
          filteredTimetables.flatMap(entry => entry.groups)
        )].sort();
        break;
      case 'instructor':
        this.filterOptions = [...new Set(
          filteredTimetables.map(entry => entry.instructor)
        )].sort();
        break;
      case 'venue':
        this.filterOptions = [...new Set(
          filteredTimetables.map(entry => entry.venue)
        )].sort();
        break;
    }
  }

  getEntriesForSlot(day: string, time: string) {
    return this.timetables.filter(entry => {
      const entryStartTime = entry.time.split('-')[0];
      if (entry.day !== day || entryStartTime !== time) return false;

      // Apply category filter
      if (this.selectedCategory && this.selectedCategory !== 'Teaching' && entry.session_type !== this.selectedCategory) {
        return false;
      }

      if (!this.filterValue) return true;

      switch (this.filterType) {
        case 'group':
          return entry.groups.includes(this.filterValue);
        case 'instructor':
          return entry.instructor === this.filterValue;
        case 'venue':
          return entry.venue === this.filterValue;
        default:
          return true;
      }
    });
  }

  downloadTimetable() {
    const data = this.timetables.filter(entry => {
      if (this.selectedCategory && this.selectedCategory !== 'Teaching' && entry.session_type !== this.selectedCategory) {
        return false;
      }
      if (!this.filterValue) return true;

      switch (this.filterType) {
        case 'group':
          return entry.groups.includes(this.filterValue);
        case 'instructor':
          return entry.instructor === this.filterValue;
        case 'venue':
          return entry.venue === this.filterValue;
        default:
          return true;
      }
    });

    const pdf = new jsPDF();
    const img = new Image();
    img.src = 'images/logo.png'; // Adjust path as needed

    img.onload = () => {
      pdf.addImage(img, 'PNG', 10, 10, 20, 20);

      const pageWidth = pdf.internal.pageSize.getWidth();
      pdf.setFont("times", "bold");
      pdf.setFontSize(12);

      const centerText = (text: string, yPos: number) => {
        const textWidth = pdf.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        pdf.text(text, x, yPos);
      };

      let y = 20;
      centerText("THE UNIVERSITY OF DODOMA", y);
      y += 8;
      centerText("COLLEGE OF INFORMATICS AND VIRTUAL EDUCATION", y);
      y += 8;
      centerText(`UNIVERSITY TEACHING TIMETABLE`, y);
      y += 8;
      centerText(`SEMESTER ${this.selectedSemester} ${this.selectedYear}`, y);
      y += 10;

      const release = new Date(); // Current date: 11:18 AM EAT, June 16, 2025
      const formattedDate = release.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      centerText(`Released on: ${formattedDate}`, y);

      const tableColumn = ["DAY", "TIME", "COURSE", "STUDENTS", "INSTRUCTOR", "VENUE"];
      const tableRows: string[][] = [];

      data.forEach(session => {
        const sessionData: string[] = [
          session.day,
          session.time,
          `${session.course_code} - (${session.session_type})`,
          session.groups.join(', '),
          session.instructor,
          session.venue
        ];
        tableRows.push(sessionData);
      });

      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.1,
          fontSize: 8
        },
        headStyles: {
          fillColor: [230, 230, 230],
          textColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle'
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          halign: 'center',
          valign: 'middle'
        },
        didParseCell: function (data) {
          const colIndex = data.column.index;
          const cell = data.cell;
          if (data.section === 'body' && colIndex === 2) {
            cell.styles.fontStyle = 'italic';
          }
        }
      });

      pdf.save(`timetable_sem${this.selectedSemester}_${this.selectedYear}_${this.filterType}_${this.filterValue || 'all'}.pdf`);
    };
  }
}