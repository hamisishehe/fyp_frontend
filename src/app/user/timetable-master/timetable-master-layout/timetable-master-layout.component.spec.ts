import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableMasterLayoutComponent } from './timetable-master-layout.component';

describe('TimetableMasterLayoutComponent', () => {
  let component: TimetableMasterLayoutComponent;
  let fixture: ComponentFixture<TimetableMasterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimetableMasterLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimetableMasterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
