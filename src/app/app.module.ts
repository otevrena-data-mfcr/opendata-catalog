import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from "@angular/forms";

// import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* SERVICES */
import { ConfigService } from './services/config.service';
import { CatalogService } from './services/catalog.service';

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
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (configService: ConfigService, catalogService: CatalogService) => async () => {
        await configService.loadConfig();
        await catalogService.loadFilters();
      },
      deps: [ConfigService, CatalogService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
