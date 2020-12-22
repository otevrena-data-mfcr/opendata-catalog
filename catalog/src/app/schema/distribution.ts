import { LangString } from './basics';


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