import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorProfileComponent } from './coordinator-profile.component';

describe('CoordinatorProfileComponent', () => {
  let component: CoordinatorProfileComponent;
  let fixture: ComponentFixture<CoordinatorProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
