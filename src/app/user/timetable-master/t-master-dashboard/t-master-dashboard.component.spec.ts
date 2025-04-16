import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterDashboardComponent } from './t-master-dashboard.component';

describe('TMasterDashboardComponent', () => {
  let component: TMasterDashboardComponent;
  let fixture: ComponentFixture<TMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
