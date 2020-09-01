import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from "@angular/forms";

// import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetViewComponent } from './pages/dataset-view/dataset-view.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { DataPreviewCsvComponent } from './components/data-preview-csv/data-preview-csv.component';
import { DataPreviewJsonComponent } from './components/data-preview-json/data-preview-json.component';
import { DataPreviewZipComponent } from './components/data-preview-zip/data-preview-zip.component';
import { DistributionCardComponent } from './components/distribution-card/distribution-card.component';

import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';
import { ConfigService } from './services/config.service';
import { CatalogService } from './services/catalog.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { NavFilterComponent } from './components/nav-filter/nav-filter.component';

@NgModule({
  declarations: [
    AppComponent,

    DatasetListComponent,
    DatasetViewComponent,
    NotFoundComponent,
    DistributionCardComponent,

    DataPreviewCsvComponent,
    DataPreviewJsonComponent,
    DataPreviewZipComponent,
    PrettyBytesPipe,
    NavFilterComponent,
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
