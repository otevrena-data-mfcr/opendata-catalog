import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

import { DatovaSada } from "otevrene-formalni-normy-dts";

interface SparqlResult<T = { [key: string]: any }> {
  head: { link: string[], vars: string[] };

  results: {
    distinct: boolean,
    ordered: boolean,
    bindings: { [K in keyof T]: { type: string, "xml:lang"?: string, value: T[K] } }[]
  }
}

type ParsedSparqlResult<P> = P extends SparqlResult<infer T> ? T[] : never;

export class QueryDefinition {
  prefix: string[] = []
  select: string[] = [];
  where?: QueryDefinitionWhere[] = [];
  filter: string[] = [];
  limit?: number;
  offset?: number;
}

type QueryDefinitionWhere = (string | { s: string, p?: string, o?: string, optional?: boolean } | { s: string, po: { p: string, o: string }[], optional?: boolean });

@Injectable({
  providedIn: 'root'
})
export class SparqlService {

  constructor(private configService: ConfigService, private http: HttpClient) { }

  async loadDatasets(options?: { limit?: number }) {

    const prefix = ["dcat: <http://www.w3.org/ns/dcat#>", "dct: <http://purl.org/dc/terms/>"];
    const where = [{ s: "?s a dcat:Dataset", po: [{ p: "dct:title", o: "?title" }, { p: "dct:publisher", o: "?publisher" }, { p: "dct:identifier", o: "?iri" }] }];
    const filter = [`?publisher = <${this.configService.config.publisher}>`];

    let datasetsQuery: QueryDefinition = {
      prefix,
      select: ["?iri", "?title"],
      where,
      filter,
      limit: options?.limit
    };

    let countQuery: QueryDefinition = {
      prefix,
      select: ["(COUNT(*) AS ?count)"],
      where,
      filter,
    };

    const datasets = await this.getResult<Partial<DatovaSada>>(this.buildQuery(datasetsQuery));

    const count = await this.getResult<{ count: number }>(this.buildQuery(countQuery)).then(result => result[0]!.count);

    return { count, datasets };

  }

  loadDataset(iri: string) {
    var query = `
    PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX dct: <http://purl.org/dc/terms/>
    SELECT ?iri ?title
    WHERE
    {
      ?s a dcat:Dataset;
          dct:title ?title ;
          dct:identifier ?iri .
      FILTER(str(?iri) = "${iri}") .
    }   
    LIMIT 1
        `;
  }

  async getResult<T>(query: string) {
    return this.http.get<SparqlResult<T>>(this.configService.config.endpoint, { params: { query }, headers: { "Accept": "application/json" } })
      .toPromise()
      .then(result => this.parseResult(result));
  }

  parseResult<T>(data: SparqlResult<T>): ParsedSparqlResult<SparqlResult<T>> {
    return data.results.bindings.map(item => Object.entries(item).reduce((acc, [key, value]) => (acc[key] = (<any>value).value, acc), {} as T)); // <any> bcs of some bad type inference in Object.entries
  }

  buildQuery(def: QueryDefinition): string {
    return `${def.prefix.map(item => "PREFIX " + item).join("\n")}
SELECT ${def.select.join(" ")}
WHERE
{
  ${def.where.map(item => this.buildQueryWhere(item)).join("\n")}
  ${ def.filter.map(item => `FILTER (${item}) .`).join("\n")}
}
${ def.offset !== undefined ? "OFFSET " + def.offset : ""}
${ def.limit !== undefined ? "LIMIT " + def.limit : ""}`;
  }

  buildQueryWhere(def: QueryDefinitionWhere) {
    if (typeof def === "string") return `${item} .`;
    if ("po" in def) return `${def.s} ; ${def.po.map(item => `${item.p} ${item.o}`).join(" ; ")} .`;
    return `${def.s} ${def.p} ${def.o} .`;
  }

}
