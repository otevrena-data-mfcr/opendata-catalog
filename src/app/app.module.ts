import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HighlightModule, HIGHLIGHT_OPTIONS } from "ngx-highlightjs";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetViewComponent } from './pages/dataset-view/dataset-view.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { DataPreviewCsvComponent } from './components/data-preview-csv/data-preview-csv.component';
import { DataPreviewJsonComponent } from './components/data-preview-json/data-preview-json.component';
import { DataPreviewZipComponent } from './components/data-preview-zip/data-preview-zip.component';
import { DistributionViewComponent } from './components/distribution-view/distribution-view.component';

import { PrettyBytesPipe } from './pipes/pretty-bytes.pipe';

@NgModule({
  declarations: [
    AppComponent,

    DatasetListComponent,
    DatasetViewComponent,
    NotFoundComponent,
    DistributionViewComponent,

    DataPreviewCsvComponent,
    DataPreviewJsonComponent,
    DataPreviewZipComponent,
    PrettyBytesPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HighlightModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
