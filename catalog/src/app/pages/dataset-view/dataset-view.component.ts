import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { flatMap } from "rxjs/operators";

import { Dataset, Distribution } from 'app/schema';

import { CatalogService } from 'app/services/catalog.service';
import { DistributionCardComponent } from 'app/components/distribution-card/distribution-card.component';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'app/services/config.service';


interface DistributionInfo {
  iri: string;
  url?: string;
  metadata?: Distribution;
  headers?: {
    lastModified: string | null;
    contentType: string | null;
    contentLength: number | null;
    acceptRanges: string | null;
  };
  preview?: string;
}

@Component({
  selector: 'app-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent implements OnInit, OnDestroy {

  dataset?: Dataset;
  childDatasets: Pick<Dataset, "iri" | "title" | "description">[] = [];
  parentDatasets: Pick<Dataset, "iri" | "title" | "description">[] = [];

  private paramsSubscription = this.route.params.subscribe(params => this.loadDataset(params["iri"]));

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadDataset(iri: string) {

    this.dataset = undefined;
    this.childDatasets = [];
    this.parentDatasets = [];

    // LOAD DATASET
    try {
      this.dataset = await this.catalog.getDataset(iri);
    }
    catch (err) {
      if (err.status === 404) return this.router.navigate(["/not-found"], { skipLocationChange: true });
      else throw err;
    }

    // LOAD CHILD DATASETS
    this.childDatasets = await this.catalog.findChildDatasets(iri);
    this.childDatasets.sort((a, b) => a.title.localeCompare(b.title));

    // LOAD PARENT DATASETS
    this.parentDatasets = await this.loadParentDatasets(this.dataset)
  }

  async loadParentDatasets(dataset: Dataset) {
    const parentDatasets = [];

    if (dataset.isPartOf) {

      let parentIri: string | undefined = dataset.isPartOf;

      while (parentIri) {
        try {
          const parent: Dataset = await this.catalog.getDataset(parentIri);
          parentDatasets.unshift(parent);
          parentIri = parent.isPartOf;
        } catch (err) { parentIri = undefined; }
      }
    }

    return parentDatasets;
  }

}
