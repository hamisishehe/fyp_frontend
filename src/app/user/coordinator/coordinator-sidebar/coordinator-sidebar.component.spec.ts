import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorSidebarComponent } from './coordinator-sidebar.component';

describe('CoordinatorSidebarComponent', () => {
  let component: CoordinatorSidebarComponent;
  let fixture: ComponentFixture<CoordinatorSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
