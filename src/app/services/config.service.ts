import { Injectable, Inject } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LocationStrategy } from '@angular/common';

import * as yamljs from "yamljs";

interface Config {
  endpoint: string;
  publishers: string[];
  ordering: "generic" | "arq_collation";
  corsGateway: string
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

    this.config = await this.http.get("./config.yml", { responseType: "text" })
      .toPromise()
      .then(yaml => <Config>yamljs.parse(yaml));

  }
}
