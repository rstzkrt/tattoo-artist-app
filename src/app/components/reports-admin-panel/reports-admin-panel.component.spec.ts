import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsAdminPanelComponent } from './reports-admin-panel.component';

describe('ReportsAdminPanelComponent', () => {
  let component: ReportsAdminPanelComponent;
  let fixture: ComponentFixture<ReportsAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportsAdminPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
