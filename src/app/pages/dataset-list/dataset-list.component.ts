import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'app/services/catalog.service';
import { Dataset } from 'app/schema';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {

  datasets: Partial<Dataset>[] = [];
  count: number = 0;

  maxLimit = Infinity;
  defaultLimit = 5;

  themesLimit = this.defaultLimit;
  keywordsLimit = this.defaultLimit;
  formatsLimit = this.defaultLimit;

  filter: {
    themes: string[],
    keywords: string[],
    formats: string[]
  } = { themes: [], keywords: [], formats: [] };

  limit = 20;

  constructor(public catalog: CatalogService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.filter.themes = [params["theme"]] || [];
      this.filter.keywords = [params["keyword"]] || [];
      this.filter.formats = [params["format"]] || [];

      this.loadDatasets();
      window.scrollTo({ top: 0 });
    });

  }

  async loadDatasets(more = false) {

    const query = {
      filter: this.filter,
      limit: this.limit,
      offset: more ? this.datasets.length : 0
    };

    const result = await this.catalog.findDatasets(query);

    if (more) this.datasets.push(...result.datasets);
    else {
      this.datasets = result.datasets;
      this.count = result.count;
    }
  }

  getPageLink(page: number) {
    return ["./", { page }];
  }

}
