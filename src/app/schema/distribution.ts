export interface DistributionFields {
  "rdf:type": string[];
  "dct:license": string[],
  "dct:format": string[],
  "dcat:accessURL": string[],
  "dcat:downloadURL": string[],
  "dcat:mediaType": string[],
  "dcat:compressFormat": string[],
  "dcat:packageFormat": string[],
}

export interface Distribution {
  iri: string;
  format: string;
  mediaType: string;
  downloadUrl: string;
  accessUrl: string;
  compressFormat: string;
  packageFormat: string;
}