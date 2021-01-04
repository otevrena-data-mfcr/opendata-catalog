
export interface Distribution {
  iri: string;
  format?: string;
  mediaType?: string;
  downloadUrl?: string;
  accessUrl?: string;
  compressFormat?: string;
  packageFormat?: string;
  accessService?: string;
}

export interface DistributionService {
  iri: string;
  title?: string;
  endpointURL?: string;
  endpointDescription?: string
}

export interface DistributionLicence {
  "autorské-dílo"?: string;
  "databáze-jako-autorské-dílo"?: string;
  "databáze-chráněná-zvláštními-právy"?: string;
  "osobní-údaje"?: string;
}