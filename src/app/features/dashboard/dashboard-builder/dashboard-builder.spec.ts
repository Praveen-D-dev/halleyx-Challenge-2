import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBuilder } from './dashboard-builder';

describe('DashboardBuilder', () => {
  let component: DashboardBuilder;
  let fixture: ComponentFixture<DashboardBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
