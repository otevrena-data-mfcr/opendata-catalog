import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreviewZipComponent } from './data-preview-zip.component';

describe('DataPreviewZipComponent', () => {
  let component: DataPreviewZipComponent;
  let fixture: ComponentFixture<DataPreviewZipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPreviewZipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPreviewZipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
