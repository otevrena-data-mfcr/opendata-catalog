import { Component, Input, OnInit } from '@angular/core';
import { DistributionLicence } from 'app/schema';
import { CatalogService } from 'app/services/catalog.service';

@Component({
  selector: 'app-distribution-license',
  templateUrl: './distribution-license.component.html',
  styleUrls: ['./distribution-license.component.scss']
})
export class DistributionLicenseComponent implements OnInit {

  @Input()
  set iri(iri: string | undefined) {
    if (iri) this.loadLicense(iri);
    else this.license = null;
  }

  license?: DistributionLicence | null;

  constructor(
    private catalog: CatalogService
  ) { }

  ngOnInit(): void {
  }

  async loadLicense(iri: string) {
    const license = await this.catalog.getDistributionLicense(iri);   
    this.license = Object.values(license).some(item => !!item) ? license : null;
  }

}
