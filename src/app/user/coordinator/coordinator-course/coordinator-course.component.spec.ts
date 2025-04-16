import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorCourseComponent } from './coordinator-course.component';

describe('CoordinatorCourseComponent', () => {
  let component: CoordinatorCourseComponent;
  let fixture: ComponentFixture<CoordinatorCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
