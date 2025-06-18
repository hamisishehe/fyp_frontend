import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ExamTimetable } from '../../../Models/ExamTimetableModel';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-t-master-ue-timetable',
  imports: [HttpClientModule,CommonModule, DragDropModule],
  templateUrl: './t-master-ue-timetable.component.html',
  styleUrl: './t-master-ue-timetable.component.css'
})
export class TMasterUeTimetableComponent {


  timetable: ExamTimetable[] = [];
  draftNumber: string = 'DRAFT TWO'; // Default value
  releaseDate: string = new Date().toISOString().split('T')[0]; // Default to today (yyyy-mm-dd)


  constructor(private http: HttpClient) {}



  ngOnInit(): void {

  }

  // Fetch timetable from backend
  GenerateTimetable(): void {

    console.log("....................................");

    const apiUrl = 'http://localhost:5000/generate_exam_timetable'; // Your Flask endpoint

    console.log("2....................................");
    this.http.post<ExamTimetable[]>(apiUrl, {}).subscribe(
      (response) => {

          this.timetable = response;
          console.log(response);

      },
      (error) => {
        console.error('Error fetching timetable:', error);
      }
    );
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
      centerText(`UNIVERSITY EXAMINATION TIMETABLE`, y);
      y += 8;
      centerText("SEMESTER TWO 2024/2025", y);
      y += 10;


      const release = new Date(this.releaseDate);
      const formattedDate = release.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      centerText(`Released on: ${formattedDate}`, y);


      const tableColumn = ["DATE", "TIME", "COURSE", "SITTING PLAN", "VENUE"];
      const tableRows: string[][] = [];

      this.timetable.forEach(session => {
        const sessionData: string[] = [
          session.actual_date,
          session.time,
          session.course_code,
          session.groups.join(', '),
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
    [prev.groups, curr.groups] = [curr.groups, prev.groups];
    [prev.venue, curr.venue] = [curr.venue, prev.venue];
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
}