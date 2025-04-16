import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterFooterComponent } from './t-master-footer.component';

describe('TMasterFooterComponent', () => {
  let component: TMasterFooterComponent;
  let fixture: ComponentFixture<TMasterFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
