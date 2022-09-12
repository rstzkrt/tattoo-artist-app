import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTattooWorkComponent } from './post-tattoo-work.component';

describe('PostTattooWorkComponent', () => {
  let component: PostTattooWorkComponent;
  let fixture: ComponentFixture<PostTattooWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostTattooWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostTattooWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
