import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigService } from './config.service';

export interface SparqlResult<T extends { [key: string]: any }> {
  head: { link: string[]; vars: string[] };

  results: {
    distinct: boolean;
    ordered: boolean;
    bindings: {
      [K in keyof T]: {
        type: string;
        value: T[K];
        datatype?: string;
        'xml:lang'?: string;
      };
    }[];
  };
}

export interface DocumentFields {
  field: string;
  value: any;
}

@Injectable({
  providedIn: 'root',
})
export class SparqlService {
  constructor(private configService: ConfigService, private http: HttpClient) {}

  async query<T>(query: string): Promise<T[]> {
    const response = await this.rawQuery<any>(query);

    return response.results.bindings.map((doc) => {
      return Object.entries(doc).reduce((acc, [key, value]) => {
        acc[key] = value.value;
        return acc;
      }, {} as any);
    });
  }

  rawQuery<T extends { [key: string]: any }>(query: string) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    return this.http.post<SparqlResult<T>>(this.configService.config.endpoint, { query }, { headers }).toPromise();
  }
}
