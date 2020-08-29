import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'app/services/catalog.service';
import { Dataset } from 'app/schema';

import { Theme } from "otevrene-formalni-normy-dts";

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {

  datasets: Partial<Dataset>[] = [];
  count: number = 0;

  themes: { title: string, iri: string }[] = Object.entries(Theme).map(([key, value]) => ({ title: key, iri: String(value) }));


  constructor(private catalog: CatalogService) {
  }

  ngOnInit(): void {
    this.loadDatasets();
  }

  async loadDatasets() {
    const result = await this.catalog.findDatasets({ limit: 20 });
    this.datasets = result.datasets;
    this.count = result.count;
  }

}
