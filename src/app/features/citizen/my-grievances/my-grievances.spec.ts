import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGrievances } from './my-grievances';

describe('MyGrievances', () => {
  let component: MyGrievances;
  let fixture: ComponentFixture<MyGrievances>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGrievances]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGrievances);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
