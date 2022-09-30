import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TattooWorkSearchComponent } from './tattoo-work-search.component';

describe('TattooWorkSearchComponent', () => {
  let component: TattooWorkSearchComponent;
  let fixture: ComponentFixture<TattooWorkSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TattooWorkSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooWorkSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
