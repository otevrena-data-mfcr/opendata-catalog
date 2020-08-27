import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreviewJsonComponent } from './data-preview-json.component';

describe('DataPreviewJsonComponent', () => {
  let component: DataPreviewJsonComponent;
  let fixture: ComponentFixture<DataPreviewJsonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPreviewJsonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPreviewJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
