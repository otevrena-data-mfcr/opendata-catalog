import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { flatMap } from "rxjs/operators";

import { Dataset, Distribution } from 'app/schema';

import { CatalogService } from 'app/services/catalog.service';

@Component({
  selector: 'app-dataset-view',
  templateUrl: './dataset-view.component.html',
  styleUrls: ['./dataset-view.component.scss']
})
export class DatasetViewComponent implements OnInit, OnDestroy {

  dataset?: Dataset;

  distributions: Distribution[] = [];
  childDatasets: Pick<Dataset, "iri" | "title" | "description">[] = [];
  parentDatasets: Pick<Dataset, "iri" | "title" | "description">[] = [];

  paramsSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private catalog: CatalogService,
  ) {


    this.paramsSubscription = route.params.subscribe(params => this.loadDataset(params["iri"]))

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  async loadDataset(iri: string) {

    try {
      this.dataset = await this.catalog.getDataset(iri);
    }
    catch (err) {
      if (err.status === 404) return this.router.navigate(["/not-found"], { replaceUrl: true });
      else throw err;
    }

    this.childDatasets = await this.catalog.findChildDatasets(iri);
    this.childDatasets.sort((a, b) => a.title.localeCompare(b.title));

    const parentDatasets = [];
    if (this.dataset.isPartOf) {

      let parentIri: string | null = this.dataset.isPartOf[0]

      while (parentIri) {
        try {
          const parent: Dataset = await this.catalog.getDataset(parentIri);
          parentDatasets.unshift(parent);
          parentIri = parent.isPartOf ? parent.isPartOf[0] : null;
        } catch (err) { parentIri = null; }
      }

    }
    this.parentDatasets = parentDatasets;

    this.distributions = [];
    if (this.dataset.distributions) {

      for (let distributionIri of this.dataset.distributions) {

        try {
          const distribution = await this.catalog.getDistribution(distributionIri);
          this.distributions.push(distribution);
        } catch (err) { }

      }
    }


  }

}
