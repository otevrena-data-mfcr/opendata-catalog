import { Component, OnInit, Input } from '@angular/core';
import { Distribution } from 'app/schema';
import { HttpClient } from '@angular/common/http';
import * as prettyBytes from "pretty-bytes";

@Component({
  selector: 'app-distribution-view',
  templateUrl: './distribution-view.component.html',
  styleUrls: ['./distribution-view.component.scss']
})
export class DistributionViewComponent implements OnInit {

  distribution?: Distribution;

  head?: any;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  @Input("distribution")
  set setDistribution(distribution: Distribution) {
    this.distribution = distribution;

    const url = this.distribution.downloadUrl || this.distribution.accessUrl;
    if (url) this.updateHead(url);
  }

  async updateHead(url: string) {
    try {
      const response = await this.http.head("https://opendata.mfcr.cz/gateway/" + url.replace("//", "/"), { observe: "response" }).toPromise();

      this.head = {
        lastModified: response.headers.get("last-modified"),
        contentType: response.headers.get("content-type"),
        contentLength: Number(response.headers.get("content-length")) || undefined,
      };
      
    } catch (err) {
      this.head = undefined;
    }

  }

}
