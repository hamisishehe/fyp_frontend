import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { Session, TimetableResponse } from '../../../Models/timetableModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment';
import { Venue } from '../../../Models/VenueModel';
import { InstructorData } from '../../../Models/InstructorModel';

type ExtendedSession = Session & { groupsStr?: string };

@Component({
  selector: 'app-t-master-teaching-timetable',
  imports: [HttpClientModule, CommonModule, DragDropModule, FormsModule],
  templateUrl: './t-master-teaching-timetable.component.html',
  styleUrls: ['./t-master-teaching-timetable.component.css']
})
export class TMasterTeachingTimetableComponent implements OnInit {

  editIndex: number | null = null;
  timetable: ExtendedSession[] = [];
  draftNumber: string = 'DRAFT TWO';
  releaseDate: string = new Date().toISOString().split('T')[0];
  semester: number = 0;
  start_time: string = '';
  isLoading: boolean = false;

  isOpen = false;
  isUploadOpen = false;

  showToast = false;
  toastMessage = '';
  toastType: 'error' | 'success' = 'success';

  venue: Venue[] = [];
  instructors: InstructorData[] = [];


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getLastTimetable();
    this.GetVenue();
    this.GetInstructors();
  }

  fetchTimetable(): void {
    const apiUrl = `${environment.baseUrl}/api/generate-timetable`;

    this.http.post<TimetableResponse>(apiUrl, {}).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.timetable = response.data.map(session => ({
            ...session,
            groupsStr: session.groups.join(', ')
          }));
          console.log(response);
        } else {
          console.error('Failed to fetch timetable:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching timetable:', error);
      }
    );
  }

  getLastTimetable(): void {
    const apiUrl = `${environment.baseUrl}/api/fetch-timetable-json`;

    this.http.get<TimetableResponse>(apiUrl).subscribe(
      (response) => {
        this.timetable = response.data.map(session => ({
          ...session,
          groupsStr: session.groups.join(', ')
        }));
        console.log(this.timetable);
      },
      (error) => {
        console.error('Error fetching timetable:', error);
      }
    );
  }

  GenerateTimeTable() {
    console.log("...............................");
    this.isLoading = true;

    const form_data = {
      start_time: this.start_time,
      semester: this.semester,
    };


    const apiUrl = `${environment.baseUrl}/api/generate-timetable`;

    this.http.post<TimetableResponse>(apiUrl, form_data).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log("1...............................");
          this.timetable = response.data.map(session => ({
            ...session,
            groupsStr: session.groups.join(', ')
          }));
          console.log("2...............................");
          this.isLoading = false;
          this.showToastMessage('Timetable generated successfully', 'success');
        } else {
          this.showToastMessage('Failed to generate timetable', 'error');
          console.error('Failed to fetch timetable:', response.message);
          this.isLoading = false;
        }
      },
      (error) => {
        this.showToastMessage('Error generating timetable', 'error');
        console.error('Error fetching timetable:', error);
      }
    );
  }

  GetInstructors(): void {
    console.log("Fetching instructors...");
    this.http.get<InstructorData[]>(`http://127.0.0.1:5000/instructors`)
      .subscribe(
        response => {
          this.instructors = response;
          console.log('Instructors fetched:', this.instructors);
          // If needed, call this.initializeTable() here or elsewhere
        },
        error => {
          console.error('Error fetching instructors:', error);
        }
      );
  }



  GetVenue(): void {
    console.log("Fetching venues...");
    this.http.get<Venue[]>(`${environment.baseUrl}/venues`)
      .subscribe(
        response => {
          this.venue = response;
          console.log('Venues fetched:', response);
        },
        error => {
          console.error('Error fetching venues:', error);
        }
      );
  }

  generatePDF() {
    const apiUrl = `${environment.baseUrl}/api/save-timetable-json`;

    const payload = {
      status: 'success',
      message: 'Timetable generated successfully.',
      data: this.timetable
    };

    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('Timetable saved successfully:', response);
        this.createPDF();
      },
      (error) => {
        console.error('Error saving timetable:', error);
      }
    );
  }

  createPDF() {
    const pdf = new jsPDF();
    const img = new Image();
    img.src = 'images/logo.png';

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
      centerText("SEMESTER ONE 2024/2025", y);
      y += 10;

      const release = new Date(this.releaseDate);
      const formattedDate = release.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      centerText(`Released on: ${formattedDate}`, y);

      const tableColumn = ["DAY", "TIME", "COURSE", "STUDENTS", "INSTRUCTOR", "VENUE"];
      const tableRows: string[][] = [];

      this.timetable.forEach(session => {
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

      pdf.save('timetable.pdf');
    };
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
  }

  enableEdit(index: number): void {
    this.editIndex = index;
    this.GetVenue(); // fetch venues on edit, if needed
  }

  saveEdit(index: number): void {
    // optionally validate/save changes
    this.editIndex = null;
    this.showToastMessage('Timetable updated successfully.', 'success');
    this.saveTimetable();
  }

  onDrop(event: CdkDragDrop<any>) {
    const draggedIndex = event.previousIndex;
    const targetIndex = event.currentIndex;

    if (draggedIndex === targetIndex) return;

    const draggedItem = this.timetable[draggedIndex];
    const targetItem = this.timetable[targetIndex];

    // Build a new session at the target's day/time
    const insertedSession = {
      ...draggedItem,
      day: targetItem.day,
      time: targetItem.time
    };

    // Check for conflicts
    const hasConflict = this.timetable.some(session =>
      session.day === insertedSession.day &&
      session.time === insertedSession.time &&
      (
        session.instructor === insertedSession.instructor ||
        session.venue === insertedSession.venue
      )
    );

    if (hasConflict) {
      this.showToastMessage(`Conflict: Instructor or venue already booked at that time.`, 'error');
      return; // ❌ Do nothing on conflict
    }

    // ✅ Insert the new session after the target
    this.timetable.splice(targetIndex + 1, 0, insertedSession);

    // ✅ Remove the original dragged session
    const removeIndex = draggedIndex > targetIndex ? draggedIndex + 1 : draggedIndex;
    this.timetable.splice(removeIndex, 1);

    this.showToastMessage('Session inserted successfully.', 'success');
    this.saveTimetable();
  }



  showToastMessage(message: string, type: 'error' | 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  saveTimetable(): void {
    const apiUrl = `${environment.baseUrl}/api/update-timetable-json`;

    const payload: TimetableResponse = {
      status: 'success',
      message: 'Updated timetable',
      generated_date: new Date().toISOString(),
      data: this.timetable.map(({ groupsStr, ...rest }) => rest), // omit groupsStr
    };

    this.http.post(apiUrl, payload).subscribe(
      () => {
        this.showToastMessage('Timetable saved to server.', 'success');
      },
      (error) => {
        this.showToastMessage('Failed to save timetable.', 'error');
        console.error('Error saving timetable:', error);
      }
    );
  }

}
