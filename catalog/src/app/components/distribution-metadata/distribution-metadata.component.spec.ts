import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionMetadataComponent } from './distribution-metadata.component';

describe('DistributionMetadataComponent', () => {
  let component: DistributionMetadataComponent;
  let fixture: ComponentFixture<DistributionMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributionMetadataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
