import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGrievances } from './all-grievances';

describe('AllGrievances', () => {
  let component: AllGrievances;
  let fixture: ComponentFixture<AllGrievances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGrievances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGrievances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
