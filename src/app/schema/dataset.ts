
import { LangString } from "./basics";

export interface DatasetFields {
  "rdf:type": string[];
  "dct:title": LangString;
  "dcat:distribution": string[];
  "dct:isPartOf": string[];
  "dct:description": LangString
}

export interface Dataset {
  iri: string;
  title: string;
  description: string;
  isPartOf: string[];
  distributions: string[];
}