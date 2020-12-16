import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributionViewComponent } from './distribution-view.component';

describe('DistributionViewComponent', () => {
  let component: DistributionViewComponent;
  let fixture: ComponentFixture<DistributionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
