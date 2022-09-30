import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TattooArtistSearchComponent } from './tattoo-artist-search.component';

describe('TattooArtistSearchComponent', () => {
  let component: TattooArtistSearchComponent;
  let fixture: ComponentFixture<TattooArtistSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TattooArtistSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TattooArtistSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
