import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArtistAccountFormComponent } from './create-artist-account-form.component';

describe('CreateArtistAccountFormComponent', () => {
  let component: CreateArtistAccountFormComponent;
  let fixture: ComponentFixture<CreateArtistAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateArtistAccountFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateArtistAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
