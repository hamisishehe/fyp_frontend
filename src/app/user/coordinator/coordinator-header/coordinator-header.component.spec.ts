import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorHeaderComponent } from './coordinator-header.component';

describe('CoordinatorHeaderComponent', () => {
  let component: CoordinatorHeaderComponent;
  let fixture: ComponentFixture<CoordinatorHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinatorHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
