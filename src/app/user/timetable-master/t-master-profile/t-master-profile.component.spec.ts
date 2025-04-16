import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterProfileComponent } from './t-master-profile.component';

describe('TMasterProfileComponent', () => {
  let component: TMasterProfileComponent;
  let fixture: ComponentFixture<TMasterProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
