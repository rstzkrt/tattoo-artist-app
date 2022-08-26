import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArtistPageComponent } from './create-artist-page.component';

describe('CreateArtistPageComponent', () => {
  let component: CreateArtistPageComponent;
  let fixture: ComponentFixture<CreateArtistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateArtistPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateArtistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
