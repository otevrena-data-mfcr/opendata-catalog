import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LocationStrategy } from '@angular/common';

export interface Config {
  endpoint: string;
  ordering: "generic" | "arq_collation";
  hideChild: boolean,
  publishers?: string[];
  corsGateway?: string,
  themesPrefix?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  config!: Config;

  constructor() { }

  public setConfig(config: Config) {
    this.config = config;
  }

  // private async loadConfig() {

  //   return await this.http.get("./config.yml", { responseType: "text" })
  //     .toPromise()
  //     .then(yaml => <Config>yamljs.parse(yaml));

  // }
}
