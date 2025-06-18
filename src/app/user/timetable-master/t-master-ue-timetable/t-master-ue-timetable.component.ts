import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ExamTimetable } from '../../../Models/ExamTimetableModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-t-master-ue-timetable',
  imports: [HttpClientModule,CommonModule, DragDropModule, FormsModule],
  templateUrl: './t-master-ue-timetable.component.html',
  styleUrl: './t-master-ue-timetable.component.css'
})
export class TMasterUeTimetableComponent {


  timetable: ExamTimetable[] = [];
  draftNumber: string = 'DRAFT TWO'; // Default value
  releaseDate: string = new Date().toISOString().split('T')[0]; // Default to today (yyyy-mm-dd)



  isLoading:boolean =false;
  semester: number = 0;
  start_time: string = '';
  start_time2: string = '';
  start_date:string ='';
  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'];
  selectedDays: string[] = [];

  showToast = false;
  toastMessage = '';
  toastType: 'error' | 'success' = 'success';

  isOpen = false;
  isUploadOpen = false;


  constructor(private http: HttpClient) {}



  ngOnInit(): void {
    this.fetchTimetable();
  }


    fetchTimetable(): void {
      const apiUrl = `${environment.baseUrl}/api/fetch-exam-timetable-json`;

      this.http.get<ExamTimetable[]>(apiUrl, {}).subscribe(
        (response) => {
           this.timetable = response;
        },
        (error) => {
          console.error('Error fetching timetable:', error);
        }
      );
    }

  // Fetch timetable from backend
  GenerateTimetable(): void {


    const form_data = {
      start_time:this.start_time2,
      start_date:this.start_date,
      semester: this.semester,
      days: this.selectedDays // 👈 include selected days
    };


    console.log("....................................");

    const apiUrl = 'http://localhost:5000/generate_exam_timetable';

    console.log("2....................................");
    this.http.post<ExamTimetable[]>(apiUrl, form_data).subscribe(
      (response) => {

          this.timetable = response;
          console.log(response);
          this.showToastMessage('Timetable generated successfully', 'success');
          window.location.reload();

      },
      (error) => {
        this.showToastMessage('Error generating timetable', 'error');
        console.error('Error fetching timetable:', error);
      }
    );
  }



  toggleDaySelection(day: string, event: Event) {
    const checkbox = (event.target as HTMLInputElement);
    if (checkbox.checked) {
      this.selectedDays.push(day);
    } else {
      this.selectedDays = this.selectedDays.filter(d => d !== day);
    }
  }


  // getLastTimetable(): void {
  //   const apiUrl = 'http://localhost:5000/last-timetable'; // Your Flask endpoint

  //   this.http.get<any>(apiUrl).subscribe(
  //     (response) => {

  //         this.timetable = response;  // Extract timetable data
  //         console.log(this.timetable);  // Log the fetched timetable

  //     },
  //     (error) => {
  //       console.error('Error fetching timetable:', error);
  //     }
  //   );
  // }


  generatePDF() {
    const pdf = new jsPDF();
    const img = new Image();
    img.src = 'images/logo.png'; // Make sure the path is correct

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
      centerText(`UNIVERSITY EXAMINATION TIMETABLE`, y);
      y += 8;
      centerText("SEMESTER ONE 2024/2025", y);
      y += 10;

      const release = new Date(this.releaseDate);
      const formattedDate = release.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      centerText(`Released on: ${formattedDate}`, y);

      const tableColumn = ["DAY", "TIME", "SITTING PLAN", "VENUE"];
      const tableRows: string[][] = [];

      this.timetable.forEach(session => {
        const row: string[] = [
          `${session.day}\n${session.date}`,
          session.time,
          `${session.date} ${session.day}\n${session.schedule}`,
          session.venue
        ];
        tableRows.push(row);
      });

      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,

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


  onDrop(event: CdkDragDrop<any[]>) {
    const draggedIndex = event.previousIndex;
    const targetIndex = event.currentIndex;

    if (draggedIndex === targetIndex) return;

    const draggedItem = this.timetable[draggedIndex];
    const targetItem = this.timetable[targetIndex];

    // Build a new session using target's time and day
    const updatedSession = {
      ...draggedItem,
      day: targetItem.day,
      date: targetItem.date,
      time: targetItem.time
    };

    // Check for conflict (same day, same time, same venue)
    const conflict = this.timetable.some(session =>
      session !== draggedItem &&
      session.day === updatedSession.day &&
      session.time === updatedSession.time &&
      session.venue === updatedSession.venue
    );

    if (conflict) {
      this.showToastMessage(`Conflict: Venue already booked on ${updatedSession.day} at ${updatedSession.time}.`, 'error');
      return;
    }

    // Insert updated session at target index
    this.timetable.splice(targetIndex, 0, updatedSession);

    // Remove old dragged session
    const removeIndex = draggedIndex > targetIndex ? draggedIndex + 1 : draggedIndex;
    this.timetable.splice(removeIndex, 1);

    this.showToastMessage('Session moved successfully.', 'success');

  }




  // Update the timetable by sending the modified timetable back to the backend
  updateTimetable(updatedTimetable: any): void {
    const apiUrl = 'http://localhost:5000/update-timetable'; // Your Flask endpoint for updating

    this.http.post<any>(apiUrl, { timetable: updatedTimetable }).subscribe(
      (response) => {
        console.log('Timetable updated successfully');
      },
      (error) => {
        console.error('Error updating timetable:', error);
      }
    );
  }


  showToastMessage(message: string, type: 'error' | 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }
}