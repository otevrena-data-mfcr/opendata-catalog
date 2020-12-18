import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataPreviewComponent } from './data-preview.component';

describe('DataPreviewComponent', () => {
  let component: DataPreviewComponent;
  let fixture: ComponentFixture<DataPreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
