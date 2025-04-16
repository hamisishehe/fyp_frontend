import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterFilesComponent } from './t-master-files.component';

describe('TMasterFilesComponent', () => {
  let component: TMasterFilesComponent;
  let fixture: ComponentFixture<TMasterFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterFilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
