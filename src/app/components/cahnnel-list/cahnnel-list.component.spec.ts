import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CahnnelListComponent } from './cahnnel-list.component';

describe('CahnnelListComponent', () => {
  let component: CahnnelListComponent;
  let fixture: ComponentFixture<CahnnelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CahnnelListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CahnnelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
