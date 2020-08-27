import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient } from '@angular/common/http';

import { SparqlService } from "app/services/sparql.service";
import { Dataset, Distribution, DatasetFields, DistributionFields } from 'app/schema';

import { QueryDefinition, Builder } from "app/lib/sparql-builder";
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  private prefixes = {
    dct: "http://purl.org/dc/terms/",
    dcat: "http://www.w3.org/ns/dcat#",
    xml: "http://www.w3.org/2001/XMLSchema#",
    purl: "http://purl.org/dc/terms/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  };

  constructor(
    private configService: ConfigService,
    private sparql: SparqlService,
  ) { }

  async findDatasets(options?: { limit?: number }, lang: string = "cs") {

    const query: QueryDefinition = {
      prefixes: this.prefixes,
      where: [{
        s: "?iri", type: "dcat:Dataset", po: [
          { p: "dct:title", o: "?title" },
          { p: "dct:publisher", o: "?publisher" }
        ]
      }],
      filter: [
        `?publisher = <${this.configService.config.publisher}>`,
        `LANG(?title) = '${lang}'`
      ],
    };

    let datasetsQuery = Object.assign({}, query, { select: ["?iri", "?title"], limit: options?.limit });
    let countQuery = Object.assign({}, query, { select: ["(COUNT(*) AS ?count)"] });

    const datasets = await this.sparql.query<Partial<Dataset>>(datasetsQuery);
    const count = await this.sparql.getResult<{ count: number }>(countQuery).then(result => result.results.bindings[0].count.value);

    return { count, datasets };

  }

  async findDocumentsByIri(iri: string) {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "?type"],
      where: [{ s: "?iri", p: "rdf:type", o: "?type" }],
      filter: [`str(?iri) = '${iri}'`]
    };

    return this.sparql.query<{ iri: string, type: string }>(query);
  }

  async findDocumentsByIdentifier(identifier: string) {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "?type"],
      where: [{ s: "?iri", po: [{ p: "rdf:type", o: "?type" }, { p: "dct:identifier", o: "?identifier" }] }],
      filter: [`str(?identifier) = '${identifier}'`]
    };

    return this.sparql.query<{ iri: string, type: string }>(query);
  }

  async findDatasetByDistribution(iri: string) {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri"],
      where: [{ s: "?iri", p: "dcat:distribution", o: "?distribution" }],
      filter: [`str(?distribution) = '${iri}'`]
    };

    return this.sparql.query<{ iri: string }>(query);
  }

  async findChildDatasets(parentIri: string) {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "?title", "?description"],
      where: [
        {
          s: "?iri", po: [
            { p: "dct:isPartOf", o: "?parentIri" },
            { p: "dct:title", o: "?title" }
          ]
        },
        { s: "?iri", p: "dct:description", o: "?description", optional: true },
      ],
      filter: [`str(?parentIri) = '${parentIri}'`]
    };

    return this.sparql.query<{ iri: string, title: string, description: string }>(query);
  }

  async getDataset(iri: string, lang: string = "cs"): Promise<Dataset> {
    const result = await this.sparql.getDocument<DatasetFields>(iri, "dcat:Dataset", this.prefixes);
    return {
      iri,
      title: result["dct:title"][lang][0],
      description: result["dct:description"][lang][0],
      isPartOf: result["dct:isPartOf"],
      distributions: result["dcat:distribution"]
    };
  }

  async getDistribution(iri: string): Promise<Distribution> {
    const result = await this.sparql.getDocument<DistributionFields>(iri, "dcat:Distribution", this.prefixes);
    return {
      iri,
      format: result["dct:format"]?.[0].replace("http://publications.europa.eu/resource/authority/file-type/", ""),
      mediaType: result["dcat:mediaType"]?.[0].replace("http://www.iana.org/assignments/media-types/",""),
      downloadUrl: result["dcat:downloadURL"]?.[0],
      accessUrl: result["dcat:accessURL"]?.[0],
      compressFormat: result["dcat:compressFormat"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
      packageFormat: result["dcat:packageFormat"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
    };
  }

  async getDocument(iri: string) {
    return this.sparql.getDocument<Dataset | Distribution>(iri, undefined, this.prefixes);
  }

}
