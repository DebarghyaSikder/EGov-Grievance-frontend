import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedGrievances } from './assigned-grievances';

describe('AssignedGrievances', () => {
  let component: AssignedGrievances;
  let fixture: ComponentFixture<AssignedGrievances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedGrievances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedGrievances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
