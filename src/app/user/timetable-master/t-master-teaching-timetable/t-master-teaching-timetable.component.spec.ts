import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterTeachingTimetableComponent } from './t-master-teaching-timetable.component';

describe('TMasterTeachingTimetableComponent', () => {
  let component: TMasterTeachingTimetableComponent;
  let fixture: ComponentFixture<TMasterTeachingTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterTeachingTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterTeachingTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
