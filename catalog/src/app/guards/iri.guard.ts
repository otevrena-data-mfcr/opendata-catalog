import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CatalogService } from 'app/services/catalog.service';

@Injectable({
  providedIn: 'root'
})
export class IriGuard implements CanActivate {

  constructor(
    private catalog: CatalogService,
    private router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    try {
      const iri = next.params["iri"];
      const type = await this.catalog.getDocumentType(iri);

      switch (type) {

        case "http://www.w3.org/ns/dcat#Dataset":
          return this.router.createUrlTree(["/datasets", iri], /* Removed unsupported properties by Angular migration: replaceUrl. */ {});

        case "http://www.w3.org/ns/dcat#Distribution":
          const datasetResult = await this.catalog.findDatasetByDistribution(iri);
          if (datasetResult[0]) return this.router.createUrlTree(["/datasets", datasetResult[0].iri]);
          else return this.router.createUrlTree(["/not-found"], /* Removed unsupported properties by Angular migration: replaceUrl. */ {});
      }

      return this.router.createUrlTree(["/not-found"]);

    }
    catch (err) {
      if (err.status === 404) return this.router.createUrlTree(["/not-found"], /* Removed unsupported properties by Angular migration: replaceUrl. */ {});
      throw err;
    }

  }

}
