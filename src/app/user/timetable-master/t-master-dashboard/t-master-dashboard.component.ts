import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-t-master-dashboard',
  imports: [HttpClientModule],
  templateUrl: './t-master-dashboard.component.html',
  styleUrl: './t-master-dashboard.component.css',
})
export class TMasterDashboardComponent implements OnInit {
  ngOnInit(): void {
    console.log('success');
    throw new Error('Method not implemented.');
  }
}
