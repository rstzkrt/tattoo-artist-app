import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TattooWorkReportsComponent } from './tattoo-work-reports.component';

describe('TattooWorkReportsComponent', () => {
  let component: TattooWorkReportsComponent;
  let fixture: ComponentFixture<TattooWorkReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TattooWorkReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooWorkReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
