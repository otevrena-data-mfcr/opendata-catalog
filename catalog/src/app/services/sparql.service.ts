import { Injectable, Query } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ConfigService } from './config.service';

import { QueryDefinitionPrefixes } from 'app/lib/sparql-builder';

export interface SparqlResult<T extends { [key: string]: any }> {
  head: { link: string[], vars: string[] };

  results: {
    distinct: boolean,
    ordered: boolean,
    bindings: {
      [K in keyof T]: {
        type: string;
        value: T[K];
        datatype?: string;
        "xml:lang"?: string;
      }
    }[];
  }

}

export interface DocumentFields {
  field: string;
  value: any;
}


@Injectable({
  providedIn: 'root'
})
export class SparqlService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
  ) {
  }



  async query<T>(query: string): Promise<T[]> {
    const response = await this.rawQuery<any>(query)

    return response.results.bindings.map(doc => {
      return Object.entries(doc).reduce((acc, [key, value]) => {
        acc[key] = value.value;
        return acc;
      }, {} as any);
    });

  }

  rawQuery<T>(query: string) {
    return this.http.get<SparqlResult<T>>(this.configService.config.endpoint, { params: { query }, headers: { "Accept": "application/json" } }).toPromise()
  }

}
