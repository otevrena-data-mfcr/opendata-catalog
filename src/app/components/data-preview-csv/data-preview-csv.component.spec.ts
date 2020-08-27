import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreviewCsvComponent } from './data-preview-csv.component';

describe('DataPreviewCsvComponent', () => {
  let component: DataPreviewCsvComponent;
  let fixture: ComponentFixture<DataPreviewCsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPreviewCsvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPreviewCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
