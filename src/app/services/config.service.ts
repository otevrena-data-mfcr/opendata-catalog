import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LocationStrategy } from '@angular/common';

import * as yamljs from "yamljs";

interface Config {
  endpoint: string;
  publisher: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config!: Config;

  constructor(
    private http: HttpClient,
    private locationStrategy: LocationStrategy
  ) { }

  async loadConfig() {
    const baseHref = this.locationStrategy.getBaseHref().replace(/\/$/, "");

    this.config = await this.http.get(baseHref + "/config.yml", { responseType: "text" })
      .toPromise()
      .then(yaml => <Config>yamljs.parse(yaml));

  }
}
