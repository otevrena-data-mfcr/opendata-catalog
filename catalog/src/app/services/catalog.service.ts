import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

import { DocumentFields, SparqlService } from "app/services/sparql.service";
import { Dataset, Distribution } from 'app/schema';

import { buildQuery, QueryDefinition } from "app/lib/sparql-builder";
import { HttpErrorResponse } from '@angular/common/http';

export interface DatasetQueryOptions {
  limit?: number;
  offset?: number;
  order?: "title";
  filter: {
    publisher?: string,
    theme?: string,
    keyword?: string,
    format?: string,
    hideChild?: boolean,
  };
}

enum Prefix {
  dct = "http://purl.org/dc/terms/",
  dcat = "http://www.w3.org/ns/dcat#",
  xml = "http://www.w3.org/2001/XMLSchema#",
  rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  skos = "http://www.w3.org/2004/02/skos/core#",
  foaf = "http://xmlns.com/foaf/0.1/",
  rpp = "https://slovník.gov.cz/legislativní/sbírka/111/2009/pojem/",
  iana = "http://www.iana.org/assignments/media-types/",
  pu = "https://data.gov.cz/slovník/podmínky-užití/",
};


@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  themes: { iri: string, label: string, count: string }[] = [];
  keywords: { label: string, count: string }[] = [];
  formats: { iri: string, label: string, count: string }[] = [];
  publishers: { iri: string, label: string, count: string }[] = [];

  lang: string = "cs";

  constructor(
    private configService: ConfigService,
    private sparql: SparqlService,
  ) { }

  async loadFilters() {
    return Promise.all([
      this.getThemes().then(themes => this.themes = themes),
      this.getKeywords().then(keywords => this.keywords = keywords),
      this.getFormats().then(formats => this.formats = formats),
      this.getPublishers().then(publishers => this.publishers = publishers),
    ]);
  }

  async findDatasets(options?: DatasetQueryOptions) {

    const query: QueryDefinition = {
      prefixes: Prefix,
      where: [
        { s: "?iri", po: [{ p: "a", o: "dcat:Dataset" }, { p: "dct:title", o: "?title" }] },
        { s: "?iri", p: "dct:description", o: "?description", optional: true, optionalFilter: `LANG(?description) = '${this.lang}'` },
      ],
      filter: [`LANG(?title) = '${this.lang}'`],
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
    if (options?.filter?.publisher) {
      query.where!.push({ s: "?iri", p: "dct:publisher", o: `<${options.filter.publisher}>` });
    }

    if (this.configService.config.publishers) {
      query.where!.push({ s: "?iri", p: "dct:publisher", o: "?publisher" });
      query.filter!.push(`?publisher IN(${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})`)
    }

    let datasetsQuery = {
      ...query,
      select: ["?iri", "?title", "?description"],
      limit: options?.limit,
      offset: options?.offset,
      group: "?iri ?title ?description"
    };

    let countQuery = {
      ...query,
      select: ["COUNT(DISTINCT ?iri) AS ?count"]
    };

    if (options?.order && ["title"].indexOf(options.order) !== -1) {
      if (this.configService.config.ordering === "arq_collation") datasetsQuery.order = `<http://jena.apache.org/ARQ/function#collation>('${this.lang}', ?title)`;
      else datasetsQuery.order = `ASC(?${options.order})`;
    }

    const datasets = await this.sparql.query<Pick<Dataset, "iri" | "title" | "description">>(buildQuery(datasetsQuery));
    const count = await this.sparql.query<{ count: number }>(buildQuery(countQuery)).then(result => result[0].count);

    return { count, datasets };

  }

  async getDocumentType(iri: string): Promise<string | undefined> {
    const query = `SELECT ?type WHERE { <${iri}> a ?type . }`;
    return this.sparql.query<{ type: string }>(query).then(data => data[0]?.type);
  }

  async findDocumentsByIdentifier(identifier: string) {
    const query = `${this.createPrefixes(["dct"])}
      SELECT ?iri ?type
      WHERE { ?iri a ?type ; dct:identifier <${identifier}> . }`

    return this.sparql.query<{ iri: string, type: string }>(query);
  }

  async findDatasetByDistribution(iri: string) {
    const query = `${this.createPrefixes(["dcat"])}
      SELECT ?iri
      WHERE { ?iri dcat:distribution <${iri}> . }`;

    return this.sparql.query<{ iri: string }>(query);
  }

  async findChildDatasets(parentIri: string) {
    const query = `${this.createPrefixes()}
      SELECT ?iri ?title ?description
      WHERE {
        ?iri dct:isPartOf <${parentIri}> .
        ?iri dct:title ?title .
        OPTIONAL { ?iri dct:description ?description . FILTER (LANG(?description) = '${this.lang}') }
        FILTER (LANG(?title) = '${this.lang}') .
      }`

    return this.sparql.query<{ iri: string, title: string, description: string }>(query);
  }

  async getDatasetParent(iri: string): Promise<Pick<Dataset, "iri" | "title">> {
    const query = `${this.createPrefixes(["dct"])}
    SELECT ?iri ?title
    WHERE {
      <${iri}> dct:isPartOf ?iri .
      ?iri dct:title ?title .
      FILTER(LANG(?title) = '${this.lang}') .
    }`

    return this.sparql.query<{ iri: string, title: string }>(query).then(results => results[0]);

  }

  async getDataset(iri: string) {

    const datasetQuery = `${this.createPrefixes(["dct", "foaf", "rpp", "skos", "dcat"])}
      SELECT ?title ?description ?publisher ?publisherIri ?documentation ?accrualPeriodicity ?temporalFrom ?temporalTo ?temporalResolution ?contactPoint
      WHERE {
        <${iri}> dct:title ?title .
        FILTER(LANG(?title) = '${this.lang}') .

        OPTIONAL { <${iri}> dct:description ?description . FILTER(LANG(?description) = '${this.lang}') }       
        OPTIONAL { <${iri}> foaf:page ?documentation . }
        OPTIONAL { 
          <${iri}> dct:publisher ?publisherIri .
          ?publisherIri foaf:name|rpp:má-název-orgánu-veřejné-moci ?publisher .
          FILTER(LANG(?publisher) = '${this.lang}') .
        }
        OPTIONAL { 
          <${iri}> dct:accrualPeriodicity ?accrualPeriodicityIri .
          ?accrualPeriodicityIri skos:prefLabel ?accrualPeriodicity .
          FILTER(LANG(?accrualPeriodicity) = '${this.lang}')
        }
        OPTIONAL { <${iri}> dct:temporal [ dcat:startDate ?temporalFrom ; dcat:endDate ?temporalTo ] . }
        OPTIONAL { <${iri}> dcat:temporalResolution ?temporalResolution . }
        OPTIONAL { <${iri}> dcat:contactPoint ?contactPoint . }
        
      }`;

    const dataset = await this.sparql.query<{
      "title": string,
      "description": string,
      "isPartOf": string,
      "publisher": string,
      "publisherIri": string,
      "documentation": string,
      "accrualPeriodicity": string,
      "temporalFrom": string,
      "temporalTo": string,
      "temporalResolution": string,
      "spatial": string,
      "conformsTo": string,
      "koncept_euroVoc": string,
    }>(datasetQuery).then(results => results[0]);

    const keywordsQuery = `${this.createPrefixes(["dcat"])}
      SELECT ?keyword
      WHERE {
        <${iri}> dcat:keyword ?keyword
        FILTER ( LANG(?keyword) = '${this.lang}' )
      }`;
    const keywords = await this.sparql.query<{ keyword: string }>(keywordsQuery).then(results => results.map(result => result.keyword));

    const themesQuery = `${this.createPrefixes(["skos", "dcat"])}
      SELECT ?iri ?title
      WHERE {
        <${iri}> dcat:theme ?iri .
        ?iri skos:prefLabel ?title .
        ${this.configService.config.themesPrefix ? `FILTER ( strstarts(str(?iri), '${this.configService.config.themesPrefix}') )` : ""}
        FILTER ( LANG(?title) = '${this.lang}' )
      }`;
    const themes = await this.sparql.query<{ iri: string, title: string }>(themesQuery);

    const distributionsQuery = `${this.createPrefixes(["dcat"])}
      SELECT ?distributionIri
      WHERE {
        <${iri}> dcat:distribution ?distributionIri .
        FILTER (!isBlank(?distributionIri))
      }`;
    const distributions = await this.sparql.query<{ distributionIri: string }>(distributionsQuery).then(results => results.map(result => result.distributionIri));

    const spatialQuery = `${this.createPrefixes(["dct"])} SELECT ?spatial WHERE { <${iri}> dct:spatial ?spatial . }`;
    const spatial = await this.sparql.query<{ spatial: string }>(spatialQuery).then(results => results.map(result => result.spatial));

    return {
      iri,
      ...dataset,
      keywords,
      themes,
      distributions,
      spatial,
    };
  }

  async getDistribution(iri: string) {

    const query = `${this.createPrefixes(["dct", "dcat", "skos"])}
      SELECT ?name ?format ?formatIri ?mediaType ?downloadUrl ?accessUrl ?compressFormat ?packageFormat ?accessService ?conformsTo
      WHERE {       
        OPTIONAL {
          <${iri}> dct:title ?title .
          FILTER(LANG(?title) = 'en') .
        }
        OPTIONAL {
          <${iri}> dct:format ?formatIri .
          ?formatIri skos:prefLabel ?format .
          FILTER(LANG(?format) = 'en') .
        }
        OPTIONAL { <${iri}> dcat:mediaType ?mediaType . }
        OPTIONAL { <${iri}> dcat:downloadURL ?downloadUrl . }
        OPTIONAL { <${iri}> dcat:accessURL ?accessUrl . }
        OPTIONAL { <${iri}> dcat:compressFormat ?compressFormat . }
        OPTIONAL { <${iri}> dcat:packageFormat ?packageFormat . }
        OPTIONAL { <${iri}> dcat:accessService ?accessService . }
        OPTIONAL { <${iri}> dct:conformsTo ?conformsTo . }
      }
      LIMIT 1
      `;
    const metadata = await this.sparql.query<{
      "title"?: string,
      "format"?: string,
      "formatIri"?: string,
      "mediaType"?: string,
      "downloadUrl"?: string,
      "accessUrl"?: string,
      "compressFormat"?: string,
      "packageFormat"?: string,
      "accessService"?: string,
      "conformsTo"?: string,
      "sch_ma"?: string,
    }>(query).then(results => results[0]);

    return {
      iri,
      title: metadata.title,
      format: metadata.format,
      formatIri: metadata.formatIri,
      mediaType: metadata.mediaType?.replace(Prefix.iana, ""),
      downloadUrl: metadata.downloadUrl,
      accessUrl: metadata.accessUrl,
      compressFormat: metadata.compressFormat?.replace(Prefix.iana, ""),
      packageFormat: metadata.packageFormat?.replace(Prefix.iana, ""),
      accessService: metadata.accessService,
      sch_ma: metadata.sch_ma,
      conformsTo: metadata.conformsTo
    };
  }
  async getDistributionService(iri: string) {

    const query = `${this.createPrefixes(["dct", "dcat"])}
        SELECT ?title ?endpointURL ?endpointDescription
        WHERE {         
          OPTIONAL { <${iri}> dct:title ?title . FILTER(LANG(?title) = '${this.lang}') . }
          OPTIONAL { <${iri}> dcat:endpointURL ?endpointURL . }
          OPTIONAL { <${iri}> dcat:endpointDescription ?endpointDescription . }
        }
        LIMIT 1`;

    const result = await this.sparql.query<{
      "title"?: string;
      "endpointURL"?: string;
      "endpointDescription"?: string;
    }>(query).then(results => results[0]);

    return {
      iri,
      title: result.title,
      endpointURL: result.endpointURL,
      endpointDescription: result.endpointDescription,
    };

  }

  async getDistributionLicense(iri: string) {
    const query = `${this.createPrefixes(["pu"])}
      SELECT ?o1 ?o2 ?o3 ?o4
      WHERE {       
        OPTIONAL { <${iri}> pu:specifikace [ pu:autorské-dílo ?o1 ] . }
        OPTIONAL { <${iri}> pu:specifikace [ pu:databáze-jako-autorské-dílo ?o2 ] . }
        OPTIONAL { <${iri}> pu:specifikace [ pu:databáze-chráněná-zvláštními-právy ?o3 ] . }
        OPTIONAL { <${iri}> pu:specifikace [ pu:osobní-údaje ?o4 ] . }
      }`;
    const result = await this.sparql.query<{
      "o1"?: string,
      "o2"?: string,
      "o3"?: string,
      "o4"?: string,
    }>(query).then(results => results[0]);

    return {
      "autorské-dílo": result.o1,
      "databáze-jako-autorské-dílo": result.o2,
      "databáze-chráněná-zvláštními-právy": result.o3,
      "osobní-údaje": result.o4,
    };
  }

  async getDocument(iri: string, type?: string) {
    const datasetQuery = `${this.createPrefixes()}
        SELECT ?field ?value
        WHERE {
          <${iri}>${type ? ` a ${type} ; ` : ""}?field ?value .
        }`;

    const datasetFieldsResult = await this.sparql.rawQuery<DocumentFields>(datasetQuery);

    if (!datasetFieldsResult.results.bindings.length) {
      throw new HttpErrorResponse({ error: "No fields for document iri", status: 404, statusText: "Not Found", url: this.configService.config.endpoint });
    }

    return datasetFieldsResult.results.bindings.reduce((acc, doc) => {

      let value = doc.value.value;
      let field = doc.field.value;
      let lang = doc.value["xml:lang"];

      if (doc.field.type === "uri") Object.entries(Prefix).forEach(([prefix, uri]) => field = field.replace(uri, prefix + ":"));
      if (doc.value.type === "uri" && typeof value === "string") Object.entries(Prefix).forEach(([prefix, uri]) => value = value.replace(uri, prefix + ":"));

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
  }


  async getPublishers() {

    const query = `${this.createPrefixes(["foaf", "rpp", "dcat", "dct"])}
      SELECT ?iri (SAMPLE(?labels) AS ?label) (COUNT(DISTINCT ?datasetIri) as ?count)
      WHERE {
        ?datasetIri a dcat:Dataset ;
          dct:publisher ?iri .
        ?iri foaf:name|rpp:má-název-orgánu-veřejné-moci ?labels .
        FILTER(LANG(?labels) = '${this.lang}')
        ${this.createPublisherFilter("?datasetIri")}
      }
      GROUP BY ?iri
      ORDER BY DESC(?count)`;

    return this.sparql.query<{ iri: string, label: string, count: string }>(query);

  }

  async getThemes() {

    const themesPrefix = this.configService.config.themesPrefix;

    const query = `${this.createPrefixes()}
      SELECT ?iri (SAMPLE(?prefLabel) AS ?label) (COUNT(DISTINCT ?datasetIri) as ?count)
      WHERE {
        ?datasetIri a dcat:Dataset ; dcat:theme ?iri .
        ?iri skos:prefLabel ?prefLabel .
        FILTER(LANG(?prefLabel) = 'cs')       
        ${themesPrefix ? `FILTER ( strstarts(str(?iri), '${themesPrefix}') )` : ""}
        ${this.createPublisherFilter("?datasetIri")}
      }
      GROUP BY ?iri
      ORDER BY DESC(?count)`;

    return this.sparql.query<{ iri: string, label: string, count: string }>(query);

  }

  async getKeywords() {
    const query = `${this.createPrefixes()}
      SELECT ?label (COUNT(DISTINCT ?datasetIri) as ?count)
      WHERE {
        ?datasetIri a dcat:Dataset ; dcat:keyword ?label .
        FILTER(LANG(?label) = 'cs') .
        ${this.createPublisherFilter("?datasetIri")}
      }
      GROUP BY ?label
      ORDER BY DESC(?count)`;
    return this.sparql.query<{ label: string, count: string }>(query);

  }

  async getFormats() {
    const query = `${this.createPrefixes()}
      SELECT ?iri (SAMPLE(?prefLabel) AS ?label) (COUNT(DISTINCT ?datasetIri) as ?count)
      WHERE {
        ?datasetIri a dcat:Dataset ; dcat:distribution ?distributionIri .
        ?distributionIri dct:format ?iri .
        ?iri skos:prefLabel ?prefLabel .
        FILTER(LANG(?prefLabel) = 'en') .
        ${this.createPublisherFilter("?datasetIri")}
      }
      GROUP BY ?iri
      ORDER BY DESC(?count)`;


    return this.sparql.query<{ iri: string, label: string, count: string }>(query);

  }

  private createPublisherFilter(iri: string) {

    if (!this.configService.config.publishers) return "";

    return `
    ${iri} dct:publisher ?publisher .
      FILTER(?publisher IN(${this.configService.config.publishers.map(item => "<" + item + ">").join(", ")})) .
        `;
  }

  private createPrefixes(prefixes?: (keyof typeof Prefix)[]) {
    if (!prefixes) prefixes = <(keyof typeof Prefix)[]>Object.keys(Prefix);

    return prefixes.map(name => `PREFIX ${name}: <${Prefix[name]}>`).join("\n");
  }


}
