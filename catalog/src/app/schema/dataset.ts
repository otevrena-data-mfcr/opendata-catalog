
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
  "dct:conformsTo": string;
  "dcat:koncept_euroVoc": string;
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
  temporal?: string;
  contactPoint?: string;
  conformsTo?: string;
  themes: { iri: string, title: string }[];
  
  documentation?: string;
  
  koncept_eurovoc?: string;
  spatial?: string[];
  temporalFrom?: string;
  temporalTo?: string;
  temporalResolution?: string;
  publisherIri?: string;
}
