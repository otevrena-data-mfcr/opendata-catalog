import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, DoBootstrap, Injector, ErrorHandler } from '@angular/core';

// import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GlobalErrorHandler } from "./error-handlers/global-error-handler";

/* PAGES */
import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetViewComponent } from './pages/dataset-view/dataset-view.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

/* COMPONENTS */
import { NavFilterComponent } from './components/nav-filter/nav-filter.component';
import { DistributionCardComponent } from './components/distribution-card/distribution-card.component';
import { DataPreviewCodeComponent } from './components/data-preview-code/data-preview-code.component';

/* PIPES */
import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';
import { DatasetCardComponent } from './components/dataset-card/dataset-card.component';
import { createCustomElement } from '@angular/elements';
import { DatasetMetadataComponent } from './components/dataset-metadata/dataset-metadata.component';
import { DistributionMetadataComponent } from './components/distribution-metadata/distribution-metadata.component';


@NgModule({
  declarations: [
    AppComponent,

    DatasetListComponent,
    DatasetViewComponent,
    NotFoundComponent,
    DistributionCardComponent,

    PrettyBytesPipe,
    NavFilterComponent,
    DatasetCardComponent,
    DataPreviewCodeComponent,
    DatasetMetadataComponent,
    DistributionMetadataComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ],
  entryComponents: [AppComponent]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) { }

  ngDoBootstrap() {
    // using createCustomElement from angular package it will convert angular component to stander web component
    const el = createCustomElement(AppComponent, {
      injector: this.injector
    });

    // using built in the browser to create your own custome element name
    customElements.define('opendata-catalog', el);
  }

}
