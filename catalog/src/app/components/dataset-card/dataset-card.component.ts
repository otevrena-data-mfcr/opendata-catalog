import { Component, Input, OnInit } from '@angular/core';
import { Dataset } from 'app/schema';

@Component({
  selector: 'app-dataset-card',
  templateUrl: './dataset-card.component.html',
  styleUrls: ['./dataset-card.component.scss'],
  host: {
    "class": "p-3"
  }
})
export class DatasetCardComponent implements OnInit {

  @Input()
  dataset!: Dataset;

  constructor() { }

  ngOnInit(): void {
  }

}
