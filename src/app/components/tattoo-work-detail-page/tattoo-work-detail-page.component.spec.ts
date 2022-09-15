import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TattooWorkDetailPageComponent } from './tattoo-work-detail-page.component';

describe('TattooWorkDetailPageComponent', () => {
  let component: TattooWorkDetailPageComponent;
  let fixture: ComponentFixture<TattooWorkDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TattooWorkDetailPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooWorkDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
