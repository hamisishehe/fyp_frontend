import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorInstructorsComponent } from './coordinator-instructors.component';

describe('CoordinatorInstructorsComponent', () => {
  let component: CoordinatorInstructorsComponent;
  let fixture: ComponentFixture<CoordinatorInstructorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorInstructorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorInstructorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
