import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterSettingsComponent } from './t-master-settings.component';

describe('TMasterSettingsComponent', () => {
  let component: TMasterSettingsComponent;
  let fixture: ComponentFixture<TMasterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
