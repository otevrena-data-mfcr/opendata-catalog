import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService } from './services/catalog.service';
import { Config, ConfigService } from './services/config.service';
import { ErrorService } from './services/error.service';

import * as packageJSON from "../../package.json";

@Component({
  selector: 'opendata-catalog',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class AppComponent implements OnInit {

  /**
   * SPARQL endpoint to load data from
   */
  @Input() endpoint?: string; // NKOD 

  /**
   * Filter publishers shown in this catalog
   * comment out following list to show all publishers
   */
  @Input() publishers?: string; // Ministry of Finance

  /**
   * Ordering method used for sorting datasets
   * use function http://jena.apache.org/ARQ/function#collation for ordering taking into account locale. works only with Jena Fuseki SPARQL endpoint
   */
  @Input() ordering: "generic" | "arq_collation" = "generic";

  /**
   * CORS gateway for accessing dataset files' last modified date and previews in case the files are not served with CORS
   * corsGateway: "https://example.com/gateway?url="
   * corsGateway: "https://example.com/gateway/"
   */
  @Input("cors-gateway") corsGateway?: string;

  /**
   * If set to true datasets will be hidden from the dataset list
   */
  @Input("hide-child") hideChild: string = "false";

  /**
   * Show only themes with specified prefix
   */
  @Input("themes-prefix") themesPrefix?: string;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private catalogService: CatalogService,
    public errorService: ErrorService
  ) { }

  ngOnInit(): void {

    if (!this.endpoint) {
      throw new Error("Endpoint property of <opendata-catalog> is required.")
    }

    const config: Config = {
      endpoint: this.endpoint,
      publishers: this.publishers ? this.publishers?.split(",") : undefined,
      ordering: this.ordering,
      corsGateway: this.corsGateway,
      hideChild: this.hideChild ? !!JSON.parse(this.hideChild) : false,
      themesPrefix: this.themesPrefix,
    };

    this.initApp(config);
  }

  async initApp(config: Config) {

    console.log(`%cOpendata Catalog
%cVersion: ${packageJSON.version}
Configuration: ${JSON.stringify(config, undefined, 2)}`, "font-weight:bold", "font-weight:normal");

    this.configService.setConfig(config);

    await this.catalogService.loadFilters();

    this.router.initialNavigation();
  }
}
