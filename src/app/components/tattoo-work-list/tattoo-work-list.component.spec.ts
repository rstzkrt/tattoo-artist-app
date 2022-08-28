import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TattooWorkListComponent } from './tattoo-work-list.component';

describe('TattooWorkListComponent', () => {
  let component: TattooWorkListComponent;
  let fixture: ComponentFixture<TattooWorkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TattooWorkListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
