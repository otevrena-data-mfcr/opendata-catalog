import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetCardComponent } from './dataset-card.component';

describe('DatasetCardComponent', () => {
  let component: DatasetCardComponent;
  let fixture: ComponentFixture<DatasetCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
