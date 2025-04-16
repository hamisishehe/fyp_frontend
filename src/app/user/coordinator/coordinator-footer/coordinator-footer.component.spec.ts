import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorFooterComponent } from './coordinator-footer.component';

describe('CoordinatorFooterComponent', () => {
  let component: CoordinatorFooterComponent;
  let fixture: ComponentFixture<CoordinatorFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
