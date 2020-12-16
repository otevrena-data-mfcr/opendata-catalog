import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, DoBootstrap, ApplicationRef, Injector, ErrorHandler } from '@angular/core';
import { FormsModule } from "@angular/forms";

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
import { DataPreviewComponent } from './components/data-preview/data-preview.component';

/* PIPES */
import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';
import { DatasetCardComponent } from './components/dataset-card/dataset-card.component';
import { createCustomElement } from '@angular/elements';


@NgModule({
  declarations: [
    AppComponent,

    DatasetListComponent,
    DatasetViewComponent,
    NotFoundComponent,
    DistributionCardComponent,

    PrettyBytesPipe,
    NavFilterComponent,
    DataPreviewComponent,
    DatasetCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    // { provide: ErrorHandler, useClass: GlobalErrorHandler }
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