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

  distributions: DistributionInfo[] = [];
  previews: DistributionInfo[] = [];
  scripts: DistributionInfo[] = [];

  previewFormats = ["text/csv", "application/json"];
  scriptFormats = ["CSV", "JSON"];

  paramsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
    private http: HttpClient,
    private config: ConfigService
  ) {
    this.paramsSubscription = route.params.subscribe(params => this.loadDataset(params["iri"]))
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadDataset(iri: string) {

    this.dataset = undefined;
    this.distributions = [];
    this.scripts = [];
    this.previews = [];
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

    // LOAD DISTRIBUTIONS
    this.distributions = this.dataset.distributions?.map(distributionIri => ({ iri: distributionIri })) || [];

    await Promise.all(this.distributions.map(distribution => this.loadDistribution(distribution)));

    this.previews = this.distributions.filter(item => item.preview);
    this.scripts = this.distributions.filter(item => item.metadata?.format && this.scriptFormats.indexOf(item.metadata.format) !== -1);

  }

  async loadParentDatasets(dataset: Dataset) {
    const parentDatasets = [];

    if (dataset.isPartOf) {

      let parentIri: string | null = dataset.isPartOf[0];

      while (parentIri) {
        try {
          const parent: Dataset = await this.catalog.getDataset(parentIri);
          parentDatasets.unshift(parent);
          parentIri = parent.isPartOf ? parent.isPartOf[0] : null;
        } catch (err) { parentIri = null; }
      }
    }

    return parentDatasets;
  }

  async loadDistribution(distribution: DistributionInfo) {

    const cacheHeaders = {
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    distribution.metadata = await this.catalog.getDistribution(distribution.iri);

    let url = distribution.metadata.downloadUrl || distribution.metadata.accessUrl;

    if (url) {
      if (this.config.config.corsGateway) url = this.config.config.corsGateway + url.replace("//", "/");
      const response = await this.http.head(url, { observe: "response", headers: cacheHeaders }).toPromise();

      distribution.url = url;

      distribution.headers = {
        lastModified: response.headers.get("last-modified"),
        contentType: response.headers.get("content-type"),
        contentLength: Number(response.headers.get("content-length")) || null,
        acceptRanges: response.headers.get("accept-ranges"),
      };
      if (distribution.headers.acceptRanges === "bytes" && distribution.headers.contentType && this.previewFormats.indexOf(distribution.headers.contentType) !== -1) {
        const headers = {
          ...cacheHeaders,
          "Range": `bytes=0-2048`
        };
        distribution.preview = await this.http.get(url, { headers, responseType: "text" }).toPromise();
      }
    }


  }

}
