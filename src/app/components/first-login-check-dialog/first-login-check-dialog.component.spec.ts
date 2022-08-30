import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLoginCheckDialogComponent } from './first-login-check-dialog.component';

describe('FirstLoginCheckDialogComponent', () => {
  let component: FirstLoginCheckDialogComponent;
  let fixture: ComponentFixture<FirstLoginCheckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirstLoginCheckDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLoginCheckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
