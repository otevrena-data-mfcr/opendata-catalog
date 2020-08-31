import { Injectable, Query } from '@angular/core';
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

  themes: { iri: string, label: string, count: string }[] = [];
  keywords: { label: string, count: string }[] = [];
  formats: { iri: string, label: string, count: string }[] = [];

  private prefixes = {
    dct: "http://purl.org/dc/terms/",
    dcat: "http://www.w3.org/ns/dcat#",
    xml: "http://www.w3.org/2001/XMLSchema#",
    purl: "http://purl.org/dc/terms/",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    skos: "http://www.w3.org/2004/02/skos/core#"
  };

  constructor(
    private configService: ConfigService,
    private sparql: SparqlService,
  ) { }

  async loadFilters() {
    this.themes = await this.getThemes();
    this.keywords = await this.getKeywords();
    this.formats = await this.getFormats();
  }

  async findDatasets(options?: { offset?: number, limit?: number }, lang: string = "cs") {

    const query: QueryDefinition = {
      prefixes: this.prefixes,
      where: [
        { s: "?iri", type: "dcat:Dataset", p: "dct:title", o: "?title" },
        { s: "?iri", p: "dct:description", o: "?description", optional: true }
      ],
      filter: [`LANG(?title) = '${lang}'`],
    };

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?iri", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN (${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    let datasetsQuery = Object.assign({}, query, { select: ["?iri", "?title", "?description"], limit: options?.limit, offset: options?.offset });
    let countQuery = Object.assign({}, query, { select: ["(COUNT(*) AS ?count)"] });

    const datasets = await this.sparql.query<Pick<Dataset, "iri" | "title" | "description">>(datasetsQuery);
    const count = await this.sparql.query<{ count: number }>(countQuery).then(result => result[0].count);

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
    const format = this.formats.find(format => format.iri === result["dct:format"]?.[0]);
    return {
      iri,
      format: format?.label,
      mediaType: result["dcat:mediaType"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
      downloadUrl: result["dcat:downloadURL"]?.[0],
      accessUrl: result["dcat:accessURL"]?.[0],
      compressFormat: result["dcat:compressFormat"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
      packageFormat: result["dcat:packageFormat"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
    };
  }

  async getDocument(iri: string) {
    return this.sparql.getDocument<Dataset | Distribution>(iri, undefined, this.prefixes);
  }

  async getThemes() {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "SAMPLE(?label) AS ?label", "COUNT(*) as ?count"],
      where: [
        { s: "?s", p: "dcat:theme", o: "?iri" },
        { s: "?iri", p: "skos:prefLabel", o: "?label" }
      ],
      filter: ["LANG(?label) = 'cs'",],
      group: "?iri",
      order: "DESC(?count)"
    };

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?s", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN (${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    return this.sparql.query<{ iri: string, label: string, count: string }>(query);

  }

  async getKeywords() {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?label", "COUNT(*) as ?count"],
      where: [{ s: "?s", p: "dcat:keyword", o: "?label" }],
      filter: ["LANG(?label) = 'cs'"],
      group: "?label",
      order: "DESC(?count)"
    };

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?s", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN (${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    return this.sparql.query<{ label: string, count: string }>(query);

  }

  async getFormats() {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "?label", "COUNT(*) as ?count"],
      where: [
        { s: "?s", type: "dcat:Dataset", p: "dcat:distribution", o: "?distributionIri" },
        { s: "?distributionIri", p: "dct:format", o: "?iri" },
        { s: "?iri", p: "skos:prefLabel", o: "?label" }
      ],
      filter: ["LANG(?label) = 'en'"],
      group: "?iri ?label",
      order: "DESC(?count)"
    };

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?s", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN (${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    return this.sparql.query<{ iri: string, label: string, count: string }>(query);

  }

}
