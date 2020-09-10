import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.scss']
})
export class DataPreviewComponent implements OnInit {

  @Input() data!: string;
  @Input() mimeType!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
