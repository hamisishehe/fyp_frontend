import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-t-master-sidebar',
  imports: [RouterLink, CommonModule],
  templateUrl: './t-master-sidebar.component.html',
  styleUrl: './t-master-sidebar.component.css',
})
export class TMasterSidebarComponent {
  sidebarOpen = false; // Track sidebar state

  ngAfterViewInit() {
    const toggleButton = document.querySelector(
      '[data-drawer-toggle="logo-sidebar"]'
    );
    const sidebar = document.getElementById('logo-sidebar');

    if (toggleButton && sidebar) {
      toggleButton.addEventListener('click', () => {
        this.sidebarOpen = !this.sidebarOpen;
        sidebar.classList.toggle('hidden', !this.sidebarOpen);
      });
    }
  }

  closeSidebar() {
    this.sidebarOpen = false;
    const sidebar = document.getElementById('logo-sidebar');
    if (sidebar) {
      sidebar.classList.add('hidden');
    }
  }
}
