import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetViewComponent } from './pages/dataset-view/dataset-view.component';

@NgModule({
  declarations: [
    AppComponent,
    DatasetListComponent,
    DatasetViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
