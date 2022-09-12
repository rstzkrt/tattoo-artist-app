import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTattooWorkComponent } from './edit-tattoo-work.component';

describe('EditTattooWorkComponent', () => {
  let component: EditTattooWorkComponent;
  let fixture: ComponentFixture<EditTattooWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditTattooWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTattooWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
