import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterHeaderComponent } from './t-master-header.component';

describe('TMasterHeaderComponent', () => {
  let component: TMasterHeaderComponent;
  let fixture: ComponentFixture<TMasterHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
