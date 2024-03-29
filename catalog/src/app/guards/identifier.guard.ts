import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CatalogService } from 'app/services/catalog.service';

@Injectable({
  providedIn: 'root'
})
export class IdentifierGuard implements CanActivate {

  constructor(
    private catalog: CatalogService,
    private router: Router,
  ) { }

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    try {
      const identifier = next.params["identifier"];
      const results = await this.catalog.findDocumentsByIdentifier(identifier);

      for (let result of results) {
        switch (result.type) {
          case "http://www.w3.org/ns/dcat#Dataset":
            return this.router.createUrlTree(["/datasets", result.iri], /* Removed unsupported properties by Angular migration: replaceUrl. */ {});
          case "http://www.w3.org/ns/dcat#Distribution":
            return this.router.createUrlTree(["/distributions", result.iri], /* Removed unsupported properties by Angular migration: replaceUrl. */ {});
        }
      }

      return this.router.createUrlTree(["/not-found"]);

    }
    catch (err) {
      if (err.status === 404) return this.router.createUrlTree(["/not-found"], /* Removed unsupported properties by Angular migration: replaceUrl. */ {});
      throw err;
    }
  }

}
