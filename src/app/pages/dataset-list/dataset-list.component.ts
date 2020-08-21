import { Component, OnInit } from '@angular/core';
import { SparqlService } from "app/services/sparql.service";
import { DatovaSada } from 'otevrene-formalni-normy-dts';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {

  datasets: Partial<DatovaSada>[] = [];
  count: number;

  constructor(private sparql: SparqlService) { }

  ngOnInit(): void {
    this.loadDatasets();
  }

  async loadDatasets() {
    const result = await this.sparql.loadDatasets({ limit: 20 });
    this.datasets = result.datasets;
    this.count = result.count;
  }

}
