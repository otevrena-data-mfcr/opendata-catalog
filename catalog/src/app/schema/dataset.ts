
import { LangString } from "./basics";

export interface DatasetFields {
  "rdf:type": string[];
  "dct:title": LangString;
  "dct:description": LangString
  "dct:isPartOf": string[];
  "dcat:distribution": string[];
  "dct:publisher": string[];
  "dcat:theme": string[];
  "dct:accrualPeriodicity": string[];
  "dcat:keyword": string[];
  "dct:spatial": string[];
  "dct:temporal": string[];
  "dcat:contactPoint": string[];
  "foaf:page": string[];
  "dct:conformsTo": string[];
  "dcat:spatialResolutionInMeters": string[];
  "dcat:temporalResolution": string[];
}

export interface Dataset {
  iri: string;
  title: string;
  description: string;
  // isPartOf: string;
  distributions?: string[];
  publisher?: string;
  accrualPeriodicity?: string;
  keywords: string[];
  spatial?: string;
  temporal?: string;
  contactPoint?: string;
  conformsTo?: string;
  spatialResolutionInMeters?: string;
  temporalResolution?: string;
  themes: { iri: string, title: string }[];

  documentation?: string;
  
  publisherIri?: string;
}