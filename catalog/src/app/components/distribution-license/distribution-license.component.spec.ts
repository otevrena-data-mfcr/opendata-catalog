import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionLicenseComponent } from './distribution-license.component';

describe('DistributionLicenseComponent', () => {
  let component: DistributionLicenseComponent;
  let fixture: ComponentFixture<DistributionLicenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributionLicenseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionLicenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
