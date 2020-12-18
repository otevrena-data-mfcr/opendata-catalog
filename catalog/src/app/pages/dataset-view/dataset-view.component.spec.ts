import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatasetViewComponent } from './dataset-view.component';

describe('DatasetViewComponent', () => {
  let component: DatasetViewComponent;
  let fixture: ComponentFixture<DatasetViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
