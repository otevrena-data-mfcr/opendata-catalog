import { LangString } from './basics';

export interface DistributionFields {
  "rdf:type"?: string[];
  "dct:license"?: string[],
  "dct:format"?: string[],
  "dcat:accessURL"?: string[],
  "dcat:accessService"?: string[],
  "dcat:downloadURL"?: string[],
  "dcat:mediaType"?: string[],
  "dcat:compressFormat"?: string[],
  "dcat:packageFormat"?: string[],
}

export interface DistributionServiceFields {
  "rdf:type"?: string[];
  "dct:title"?: LangString;
  "dcat:endpointURL"?: string[];
  "dcat:endpointDescription"?: string[];
}

export interface Distribution {
  iri: string;
  format?: string;
  mediaType?: string;
  downloadUrl?: string;
  accessUrl?: string;
  compressFormat?: string;
  packageFormat?: string;
  accessService?: DistributionService;
}

export interface DistributionService {
  iri: string;
  title?: string;
  endpointURL?: string;
  endpointDescription?: string
}