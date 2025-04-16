import { Component } from '@angular/core';
import { CoordinatorHeaderComponent } from "../coordinator-header/coordinator-header.component";
import { CoordinatorSidebarComponent } from "../coordinator-sidebar/coordinator-sidebar.component";
import { CoordinatorFooterComponent } from "../coordinator-footer/coordinator-footer.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-coordinator-layout',
  imports: [CoordinatorHeaderComponent, CoordinatorSidebarComponent, CoordinatorFooterComponent, RouterOutlet],
  templateUrl: './coordinator-layout.component.html',
  styleUrl: './coordinator-layout.component.css'
})
export class CoordinatorLayoutComponent {

}
