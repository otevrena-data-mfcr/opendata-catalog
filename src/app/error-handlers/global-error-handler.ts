import { ErrorHandler, Injectable, Injector } from "@angular/core";
import { ErrorService } from "app/services/error.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) {
  }

  handleError(error: any): void {
    const errorService = this.injector.get(ErrorService);
    errorService.showError(error)
  }

}