import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-t-master-ue-timetable',
  imports: [CommonModule,HttpClientModule],
  templateUrl: './t-master-ue-timetable.component.html',
  styleUrl: './t-master-ue-timetable.component.css'
})
export class TMasterUeTimetableComponent {

}
