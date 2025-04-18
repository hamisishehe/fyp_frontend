import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorAssignCourseComponent } from './coordinator-assign-course.component';

describe('CoordinatorAssignCourseComponent', () => {
  let component: CoordinatorAssignCourseComponent;
  let fixture: ComponentFixture<CoordinatorAssignCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorAssignCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorAssignCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
