import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataPreviewCodeComponent } from './data-preview-code.component';

describe('DataPreviewCodeComponent', () => {
  let component: DataPreviewCodeComponent;
  let fixture: ComponentFixture<DataPreviewCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataPreviewCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPreviewCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
