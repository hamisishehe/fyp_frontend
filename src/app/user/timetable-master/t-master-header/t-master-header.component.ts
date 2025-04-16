import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-t-master-header',
  imports: [],
  templateUrl: './t-master-header.component.html',
  styleUrl: './t-master-header.component.css',
})
export class TMasterHeaderComponent implements AfterViewInit {
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
