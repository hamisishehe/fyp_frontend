import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Session, TimetableResponse } from '../../../Models/timetableModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-t-master-teaching-timetable',
  imports: [HttpClientModule,CommonModule, DragDropModule, FormsModule],
  templateUrl: './t-master-teaching-timetable.component.html',
  styleUrl: './t-master-teaching-timetable.component.css'
})
export class TMasterTeachingTimetableComponent implements OnInit {

  timetable: Session[] = [];
  draftNumber: string = 'DRAFT TWO'; // Default value
  releaseDate: string = new Date().toISOString().split('T')[0]; // Default to today (yyyy-mm-dd)

  semester:number=0;
  start_time:string ='';
  isloading:boolean = false;


  isOpen = false;
  isUploadOpen=false;
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}



  ngOnInit(): void {
    this.getLastTimetable();
  }




  fetchTimetable(): void {
    const apiUrl = `${environment.baseUrl}/api/generate-timetable`;

    this.http.post<TimetableResponse>(apiUrl, {}).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.timetable = response.data;
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
        this.timetable = response.data;
        console.log(this.timetable);
      },
      (error) => {
        console.error('Error fetching timetable:', error);
      }
    );
  }


  GenerateTimeTable(){
    this.isLoading = true;

    console.log("................")

    const form_data = {
      start_time: this.start_time,
      semester: this.semester,
    };

    console.log(form_data);

    const headers = { 'Content-Type': 'application/json' };


    const apiUrl = `${environment.baseUrl}/api/generate-timetable`;

    this.http.post<TimetableResponse>(apiUrl, form_data, {headers}).subscribe(
      (response) => {
        if (response.status === 'success') {
          console.log(response);
         this.timetable = response.data;
         this.isLoading = false;
        } else {
          console.error('Failed to fetch timetable:', response.message);
        }
      },
      (error) => {
        console.error('Error fetching timetable:', error);
      }
    );


  }


  generatePDF(){


    const apiUrl = `${environment.baseUrl}/api/save-timetable-json`;

    const payload = {
      status: 'success',
      message: 'Timetable generated successfully.',
      data: this.timetable
    };

    this.http.post(apiUrl, payload).subscribe(
      (response) => {
        console.log('Timetable saved successfully:', response);
        this.createPDF();  // You can keep this logic
      },
      (error) => {
        console.error('Error saving timetable:', error);
      }
    );

  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
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

          // Make Course italic (column index 2)
          if (data.section === 'body' && colIndex === 2) {
            cell.styles.fontStyle = 'italic';
          }


        }
      });

      pdf.save('timetable.pdf');
    };
  }


  onDrop(event: CdkDragDrop<any[]>) {
    const prev = this.timetable[event.previousIndex];
    const curr = this.timetable[event.currentIndex];

    if (event.previousIndex === event.currentIndex) return;

    // Swap only the specified fields
    [prev.course_code, curr.course_code] = [curr.course_code, prev.course_code];
    [prev.course_name, curr.course_name] = [curr.course_name, prev.course_name];
    [prev.groups, curr.groups] = [curr.groups, prev.groups];
    [prev.instructor, curr.instructor] = [curr.instructor, prev.instructor];
    [prev.venue, curr.venue] = [curr.venue, prev.venue];
  }

  // Update the timetable by sending the modified timetable back to the backend
  updateTimetable(updatedTimetable: any): void {
    const apiUrl = 'http://localhost:5000/api/update-timetable'; // Your Flask endpoint for updating

    this.http.post<any>(apiUrl, { timetable: updatedTimetable }).subscribe(
      (response) => {
        console.log('Timetable updated successfully');
      },
      (error) => {
        console.error('Error updating timetable:', error);
      }
    );
  }

}
