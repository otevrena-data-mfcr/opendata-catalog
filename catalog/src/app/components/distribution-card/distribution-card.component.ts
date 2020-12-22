import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Distribution, DistributionService } from 'app/schema';
import { HttpClient } from '@angular/common/http';
import * as prettyBytes from "pretty-bytes";
import { ConfigService } from 'app/services/config.service';
import { CatalogService } from 'app/services/catalog.service';

@Component({
  selector: 'app-distribution-card',
  templateUrl: './distribution-card.component.html',
  styleUrls: ['./distribution-card.component.scss'],
  host: {
    "class": "d-block p-3"
  }
})
export class DistributionCardComponent implements OnInit, OnChanges {

  @Input()
  iri?: string;

  url?: string;

  distribution?: Distribution;
  distributionService?: DistributionService;

  headers?: {
    lastModified: string | null,
    contentType: string | null,
    contentLength: number | null,
    acceptRanges: string | null
  };

  tab: string = "metadata";

  private previewFormats = {
    code: ["text/csv", "application/json", "application/xml"],
    table: ["text/csv"]
  };

  showPreview: { [type: string]: boolean } = {};

  constructor(
    private catalog: CatalogService,
    private config: ConfigService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges) {

    if (this.iri) {
      this.load(this.iri);
    }
    else {
      this.distribution = undefined;
      this.distributionService = undefined;
      this.headers = undefined;
    }

  }

  private async load(iri: string) {
    this.distribution = await this.catalog.getDistribution(iri);

    this.url = this.distribution.downloadUrl || this.distribution.accessUrl;

    if (this.distribution?.accessService) {
      this.distributionService = await this.catalog.getDistributionService(this.distribution.accessService);
    }

    if (!this.distributionService && this.url) {

      this.headers = await this.loadHeaders(this.url);

      // show preview only if we can load arbitrary bytes of file
      this.showPreview = {};

      if (this.headers?.acceptRanges === "bytes") {
        Object.entries(this.previewFormats).forEach(([type, mime]) => {
          this.showPreview[type] = !!this.headers?.contentType && mime.indexOf(this.headers?.contentType) !== -1;
        });
      }
    }

  }

  private async loadHeaders(url: string) {

    if (this.config.config.corsGateway) url = this.config.config.corsGateway + url.replace("//", "/");

    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    try {
      const response = await this.http.head(url, { observe: "response", headers: headers, }).toPromise();

      return {
        lastModified: response.headers.get("last-modified"),
        contentType: response.headers.get("content-type"),
        contentLength: Number(response.headers.get("content-length")) || null,
        acceptRanges: response.headers.get("accept-ranges"),
      }
    }
    catch (err) {
      return undefined;
    }
  }

}
