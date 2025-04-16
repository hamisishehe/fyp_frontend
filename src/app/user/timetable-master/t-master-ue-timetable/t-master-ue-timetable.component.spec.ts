import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterUeTimetableComponent } from './t-master-ue-timetable.component';

describe('TMasterUeTimetableComponent', () => {
  let component: TMasterUeTimetableComponent;
  let fixture: ComponentFixture<TMasterUeTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterUeTimetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterUeTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
