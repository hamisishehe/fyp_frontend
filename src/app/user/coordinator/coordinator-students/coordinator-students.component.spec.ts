import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorStudentsComponent } from './coordinator-students.component';

describe('CoordinatorStudentsComponent', () => {
  let component: CoordinatorStudentsComponent;
  let fixture: ComponentFixture<CoordinatorStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
