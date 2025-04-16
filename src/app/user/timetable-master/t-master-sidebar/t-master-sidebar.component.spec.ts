import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TMasterSidebarComponent } from './t-master-sidebar.component';

describe('TMasterSidebarComponent', () => {
  let component: TMasterSidebarComponent;
  let fixture: ComponentFixture<TMasterSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TMasterSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TMasterSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
