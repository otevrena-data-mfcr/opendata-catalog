import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

import { SparqlService } from "app/services/sparql.service";
import { Dataset, Distribution, DatasetFields, DistributionFields, DistributionServiceFields } from 'app/schema';

import { QueryDefinition } from "app/lib/sparql-builder";

export interface DatasetQueryOptions {
  limit?: number;
  offset?: number;
  order?: "title";
  filter: {
    theme?: string[],
    keyword?: string[],
    format?: string[],
    hideChild?: boolean,
  };
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  themes: { iri: string, label: string, count: string }[] = [];
  keywords: { label: string, count: string }[] = [];
  formats: { iri: string, label: string, count: string }[] = [];

  lang: string = "cs";

  private prefixes = {
    dct: "http://purl.org/dc/terms/",
    dcat: "http://www.w3.org/ns/dcat#",
    xml: "http://www.w3.org/2001/XMLSchema#",
    rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    skos: "http://www.w3.org/2004/02/skos/core#",
    foaf: "http://xmlns.com/foaf/0.1/",
  };

  constructor(
    private configService: ConfigService,
    private sparql: SparqlService,
  ) { }

  async loadFilters() {
    return Promise.all([
      this.getThemes().then(themes => this.themes = themes),
      this.getKeywords().then(keywords => this.keywords = keywords),
      this.getFormats().then(formats => this.formats = formats),
    ]);
  }

  async findDatasets(options?: DatasetQueryOptions) {

    const query: QueryDefinition = {
      prefixes: this.prefixes,
      where: [
        { s: "?iri", po: [{ p: "a", o: "dcat:Dataset" }, { p: "dct:title", o: "?titles" }] },
        { s: "?iri", p: "dct:description", o: "?descriptions", optional: true },
        { s: "?iri", p: "dcat:distribution", o: "?distribution", optional: true },
        { s: "?distribution", p: "dct:format", o: `?format`, optional: true }
      ],
      filter: [`LANG(?titles) = '${this.lang}'`],
    };

    if (options?.filter?.hideChild) query.filter!.push({ ne: true, condition: "{ ?iri dct:isPartOf ?isPart }" });

    if (options?.filter?.theme) query.where!.push({ s: "?iri", p: "dcat:theme", o: `<${options.filter.theme}>` });

    if (options?.filter?.keyword) {
      query.where!.push({ s: "?iri", p: "dcat:keyword", o: "?keyword" });
      query.filter!.push(`?keyword = '${options.filter.keyword}'@${this.lang}`);
    }
    if (options?.filter?.format) {
      query.where!.push({ s: "?iri", p: "dcat:distribution", o: "?distribution" });
      query.where!.push({ s: "?distribution", p: "dct:format", o: `<${options.filter.format}>` });
    }

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?iri", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN(${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    let datasetsQuery = {
      ...query,
      select: ["?iri", "str(SAMPLE(?titles)) as ?title", "SAMPLE(?descriptions) as ?description"],
      limit: options?.limit,
      offset: options?.offset,
      group: "?iri"
    };

    let countQuery = {
      ...query,
      select: ["COUNT(distinct ?iri) AS ?count"]
    };

    if (options?.order && ["title"].indexOf(options.order) !== -1) {
      if (this.configService.config.ordering === "arq_collation") datasetsQuery.order = `<http://jena.apache.org/ARQ/function#collation>('${this.lang}', ?title)`;
      else datasetsQuery.order = `ASC(?${options.order})`;
    }

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
        { s: "?iri", p: "dct:description", o: "?description", optional: true, optionalFilter: `LANG(?description) = '${this.lang}'` },
      ],
      filter: [
        `str(?parentIri) = '${parentIri}'`,
        `LANG(?title) = '${this.lang}'`
      ]
    };

    return this.sparql.query<{ iri: string, title: string, description: string }>(query);
  }

  async getDataset(iri: string, lang: string = "cs"): Promise<Dataset> {

    const datasetQuery: QueryDefinition = {
      prefixes: this.prefixes,
      select: [
        "?title",
        "?description",
        "?isPartOf",
        "?publisher",
        "?documentation",
      ],
      where: [
        { s: `<${iri}>`, p: "dct:title", o: "?title" },
        { s: `<${iri}>`, optional: true, p: "dct:description", o: "?description" },
        { s: `<${iri}>`, optional: true, p: "dct:isPartOf", o: "?isPartOf" },
        { s: `<${iri}>`, optional: true, p: "foaf:page", o: "?documentation" },
        { s: `<${iri}>`, optional: true, p: "dct:publisher", o: "?publisher" },
      ]
    };

    const dataset = await this.sparql.query<Pick<Dataset, "title" | "description" | "isPartOf" | "publisher" | "documentation">>(datasetQuery).then(results => results[0]);

    const keywordsQuery = {
      prefixes: this.prefixes,
      select: ["?keyword"],
      where: [{ s: `<${iri}>`, p: "dct:keyword", o: "?keyword" }]
    };
    const keywords = await this.sparql.query<{ keyword: string }>(keywordsQuery).then(results => results.map(result => result.keyword));

    const themesQuery = {
      prefixes: this.prefixes,
      select: ["?iri", "?title"],
      where: [
        { s: `<${iri}>`, p: "dcat:theme", o: "?iri" },
        { s: "?iri", p: "skos:prefLabel", o: "?title" },
      ],
      filter: [`LANG(?title) = '${lang}'`]
    };
    const themes = await this.sparql.query<{ iri: string, title: string }>(themesQuery);

    const distributionsQuery = {
      prefixes: this.prefixes,
      select: ["?distributionIri"],
      where: [{ s: `<${iri}>`, p: "dcat:distribution", o: "?distributionIri" }],
    };
    const distributions = await this.sparql.query<{ distributionIri: string }>(distributionsQuery).then(results => results.map(result => result.distributionIri));

    return {
      iri,
      ...dataset,
      keywords,
      themes,
      distributions,
      // accrualPeriodicity: result["dct:accrualPeriodicity"]?.[0],
      // // conformsTo,
      // contactPoint: result["dcat:contactPoint"]?.[0],
      // publisher: result["dct:publisher"]?.[0],
      // // spatial,
      // // spatialResolutionInMeters,
      // // temporal,
      // // temporalResolution,
    };
  }

  async getDistribution(iri: string, lang: string = "cs"): Promise<Distribution> {
    const result = await this.sparql.getDocumentFields<DistributionFields>(iri, "dcat:Distribution", this.prefixes);
    const format = this.formats.find(format => format.iri === result["dct:format"]?.[0]);

    const distribution: Distribution = {
      iri,
      format: format?.label,
      mediaType: result["dcat:mediaType"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
      downloadUrl: result["dcat:downloadURL"]?.[0],
      accessUrl: result["dcat:accessURL"]?.[0],
      compressFormat: result["dcat:compressFormat"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
      packageFormat: result["dcat:packageFormat"]?.[0].replace("http://www.iana.org/assignments/media-types/", ""),
    };

    if (result["dcat:accessService"]) {
      const serviceResult = await this.sparql.getDocumentFields<DistributionServiceFields>(result["dcat:accessService"][0], "dcat:DataService", this.prefixes);

      distribution.accessService = {
        iri: result["dcat:accessService"]?.[0],
        title: serviceResult["dct:title"]?.[lang]?.[0],
        endpointURL: serviceResult["dcat:endpointURL"]?.[0],
        endpointDescription: serviceResult["dcat:endpointDescription"]?.[0],
      }
    }

    return distribution;
  }

  async getDocument(iri: string) {
    return this.sparql.getDocumentFields<Dataset | Distribution>(iri, undefined, this.prefixes);
  }

  async getThemes() {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "SAMPLE(?prefLabel) AS ?label", "COUNT(*) as ?count"],
      where: [
        {
          s: "?datasetIri", po: [
            { p: "a", o: "dcat:Dataset" },
            { p: "dcat:theme", o: "?iri" }
          ]
        },
        { s: "?iri", p: "skos:prefLabel", o: "?prefLabel" }
      ],
      filter: ["LANG(?prefLabel) = 'cs'",],
      group: "?iri",
      order: "DESC(?count)"
    };

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?datasetIri", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN(${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
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
      query.filter!.push(`?publisher IN(${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    return this.sparql.query<{ label: string, count: string }>(query);

  }

  async getFormats() {
    const query: QueryDefinition = {
      prefixes: this.prefixes,
      select: ["?iri", "SAMPLE(?prefLabel) AS ?label", "COUNT(DISTINCT ?datasetIri) as ?count"],
      where: [
        { s: "?datasetIri", po: [{ p: "a", o: "dcat:Dataset" }, { p: "dcat:distribution", o: "?distributionIri" }] },
        { s: "?distributionIri", p: "dct:format", o: "?iri" },
        { s: "?iri", p: "skos:prefLabel", o: "?prefLabel" }
      ],
      filter: ["LANG(?prefLabel) = 'en'"],
      group: "?iri",
      order: "DESC(?count)"
    };

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?datasetIri", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN(${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    return this.sparql.query<{ iri: string, label: string, count: string }>(query);

  }

}
