import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-preview-code',
  templateUrl: './data-preview-code.component.html',
  styleUrls: ['./data-preview-code.component.scss']
})
export class DataPreviewCodeComponent implements OnInit, OnChanges {

  @Input()
  url?: string;

  @Input()
  mime: string = "text/plain";

  data?: string;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.url) {
      this.load(this.url)
    }
    else {
      this.data = undefined;
    }
  }

  async load(url: string) {

    this.data = "Načítám...";

    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      "Range": `bytes=0-2048`
    };

    this.data = await this.http.get(url, { headers, responseType: "text" }).toPromise();

  }

}
