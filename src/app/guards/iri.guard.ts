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
      const results = await this.catalog.findDocumentsByIri(iri);

      for (let result of results) {
        switch (result.type) {

          case "http://www.w3.org/ns/dcat#Dataset":
            return this.router.createUrlTree(["/datasets", result.iri], { replaceUrl: true });

          case "http://www.w3.org/ns/dcat#Distribution":
            const datasetResult = await this.catalog.findDatasetByDistribution(result.iri);
            if (datasetResult[0]) return this.router.createUrlTree(["/datasets", datasetResult[0].iri]);
            else return this.router.createUrlTree(["/not-found"], { replaceUrl: true });
        }
      }

      return this.router.createUrlTree(["/not-found"]);

    }
    catch (err) {
      if (err.status === 404) return this.router.createUrlTree(["/not-found"], { replaceUrl: true });
      throw err;
    }

  }

}
