import { Injectable, Query } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { ConfigService } from './config.service';

import { QueryDefinition, Builder, QueryDefinitionPrefixes, QueryDefinitionWhere } from 'app/lib/sparql-builder';

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

  endpoint: string;

  constructor(
    configService: ConfigService,
    private http: HttpClient,
  ) {
    this.endpoint = configService.config.endpoint;
  }

  async getDocument<T>(iri: string, type?: string, prefixes: QueryDefinitionPrefixes = {}) {

    const datasetQuery: QueryDefinition = {
      prefixes,
      select: ["?field", "?value"],
      where: [
        { s: `<${iri}>`, type: type, p: "?field", o: "?value" }
      ]
    };

    const datasetFieldsResult = await this.getResult<DocumentFields>(datasetQuery);

    if (!datasetFieldsResult.results.bindings.length) {
      throw new HttpErrorResponse({ error: "No fields for document iri", status: 404, statusText: "Not Found", url: this.endpoint });
    }

    return this.parseDocumentResult<T>(datasetFieldsResult, prefixes);
  }

  async query<T>(query: QueryDefinition): Promise<T[]> {
    const response = await this.getResult<any>(query)

    return response.results.bindings.map(doc => {
      return Object.entries(doc).reduce((acc, [key, value]) => {
        acc[key] = value.value;
        return acc;
      }, {} as any);
    });

  }

  private async getResult<T>(query: string | QueryDefinition) {

    if (typeof query === "object") query = Builder.buildQuery(query);

    return this.http.get<SparqlResult<T>>(this.endpoint, { params: { query }, headers: { "Accept": "application/json" } }).toPromise()
  }

  private parseDocumentResult<T>(result: SparqlResult<DocumentFields>, prefixes: QueryDefinitionPrefixes = {}): T {

    return result.results.bindings.reduce((acc, doc) => {

      let value = doc.value.value;
      let field = doc.field.value;
      let lang = doc.value["xml:lang"];

      if (doc.field.type === "uri") Object.entries(prefixes).forEach(([prefix, uri]) => field = field.replace(uri, prefix + ":"));
      if (doc.value.type === "uri" && typeof value === "string") Object.entries(prefixes).forEach(([prefix, uri]) => value = value.replace(uri, prefix + ":"));

      if (lang) {
        if (!acc[field]) acc[field] = {};
        if (!acc[field][lang]) acc[field][lang] = [];
        acc[field][lang].push(value);
      }
      else {
        if (!acc[field]) acc[field] = [];
        acc[field].push(value);
      }
      return acc;

    }, {} as any);
  };
}
