import { Component, OnInit } from '@angular/core';
import { CatalogService, DatasetQueryOptions } from 'app/services/catalog.service';
import { Dataset } from 'app/schema';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavFilterOption } from 'app/components/nav-filter/nav-filter.component';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss']
})
export class DatasetListComponent implements OnInit {

  datasets: Partial<Dataset>[] = [];
  count: number = 0;

  themes: NavFilterOption[];
  keywords: NavFilterOption[];
  formats: NavFilterOption[];

  filter: DatasetQueryOptions["filter"] = {
    hideChild: true
  };

  limit = 20;

  constructor(
    public catalog: CatalogService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.themes = this.catalog.themes.map(item => ({ ...item, value: item.iri }));
    this.keywords = this.catalog.keywords.map(item => ({ ...item, value: item.label }));
    this.formats = this.catalog.formats.map(item => ({ ...item, value: item.iri }));
  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {

      this.filter.theme = params["theme"];
      this.filter.keyword = params["keyword"];
      this.filter.format = params["format"];
      
      if (params["hideChild"] !== undefined) this.filter.hideChild = (params["hideChild"] === "true" || params["hideChild"] === true);

      this.loadDatasets();
      window.scrollTo({ top: 0 });
    });



  }

  async loadDatasets(more = false) {

    const query: DatasetQueryOptions = {
      filter: this.filter,
      limit: this.limit,
      offset: more ? this.datasets.length : 0,
      order: "title",
    };

    const result = await this.catalog.findDatasets(query);

    if (more) this.datasets.push(...result.datasets);
    else {
      this.datasets = result.datasets;
      this.count = result.count;
    }
  }

  setFilter() {
    const filter = JSON.parse(JSON.stringify(this.filter));
    this.router.navigate(["./", filter], { replaceUrl: true });
  }

  getPageLink(page: number) {
    return ["./", { page }];
  }

}
