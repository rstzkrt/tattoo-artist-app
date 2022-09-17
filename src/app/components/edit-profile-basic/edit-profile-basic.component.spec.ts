import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileBasicComponent } from './edit-profile-basic.component';

describe('EditProfileBasicComponent', () => {
  let component: EditProfileBasicComponent;
  let fixture: ComponentFixture<EditProfileBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditProfileBasicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProfileBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
