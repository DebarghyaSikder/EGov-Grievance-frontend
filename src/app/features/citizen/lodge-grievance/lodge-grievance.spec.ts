import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgeGrievance } from './lodge-grievance';

describe('LodgeGrievance', () => {
  let component: LodgeGrievance;
  let fixture: ComponentFixture<LodgeGrievance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LodgeGrievance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LodgeGrievance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
