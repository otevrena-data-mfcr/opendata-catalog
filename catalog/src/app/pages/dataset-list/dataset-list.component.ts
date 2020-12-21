import { Component, OnInit } from '@angular/core';
import { CatalogService, DatasetQueryOptions } from 'app/services/catalog.service';
import { Dataset } from 'app/schema';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NavFilterOption } from 'app/components/nav-filter/nav-filter.component';
import { ConfigService } from 'app/services/config.service';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.scss'],
  host: {
    "class": "d-block py-3"
  }
})
export class DatasetListComponent implements OnInit {

  datasets: Partial<Dataset>[] = [];
  count: number = 0;

  themes: NavFilterOption[];
  keywords: NavFilterOption[];
  formats: NavFilterOption[];
  publishers: NavFilterOption[];

  filter: DatasetQueryOptions["filter"];

  limit = 20;

  loading: boolean = false;

  constructor(
    public catalog: CatalogService,
    private route: ActivatedRoute,
    private router: Router,
    private config: ConfigService
  ) {
    this.publishers = this.catalog.publishers.map(item => ({ ...item, value: item.iri }));
    this.themes = this.catalog.themes.map(item => ({ ...item, value: item.iri }));
    this.keywords = this.catalog.keywords.map(item => ({ ...item, value: item.label }));
    this.formats = this.catalog.formats.map(item => ({ ...item, value: item.iri }));

    if (this.config.config.themesPrefix) {
      this.themes = this.themes.filter(theme => theme.value.startsWith(this.config.config.themesPrefix!));
    }

    this.filter = {
      hideChild: config.config.hideChild
    };
  }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {

      this.filter.theme = <string>params["theme"];
      this.filter.keyword = <string>params["keyword"];
      this.filter.format = <string>params["format"];
      this.filter.publisher = <string>params["publisher"];

      if (params["hideChild"] !== undefined) this.filter.hideChild = (<string>params["hideChild"] === "true" || params["hideChild"] === true);

      this.loadDatasets();
      window.scrollTo({ top: 0 });
    });



  }

  async loadDatasets(more = false) {

    this.loading = true;
    if (!more) {
      this.datasets = [];
      this.count = 0;
    }

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

    this.loading = false;
  }

  getFilterLink(updateFilter: Partial<DatasetQueryOptions["filter"]> = {}, replace = false): any[] {
    const filter = Object.assign({}, this.filter, updateFilter);
    return ["./", JSON.parse(JSON.stringify(filter))]; // JSON parse and stringify removes undefined values
  }

  updateFilter() {
    this.router.navigate(this.getFilterLink(), { replaceUrl: true });
  }

}
