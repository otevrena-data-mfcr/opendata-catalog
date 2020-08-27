import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'app/services/catalog.service';
import { Dataset } from 'app/schema';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {

  datasets: Partial<Dataset>[] = [];
  count: number = 0;

  constructor(private catalog: CatalogService) { }

  ngOnInit(): void {
    this.loadDatasets();
  }

  async loadDatasets() {
    const result = await this.catalog.findDatasets({ limit: 20 });
    this.datasets = result.datasets;
    this.count = result.count;
  }

}
