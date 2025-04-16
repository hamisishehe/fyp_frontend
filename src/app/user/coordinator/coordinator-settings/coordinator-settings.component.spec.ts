import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorSettingsComponent } from './coordinator-settings.component';

describe('CoordinatorSettingsComponent', () => {
  let component: CoordinatorSettingsComponent;
  let fixture: ComponentFixture<CoordinatorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
