import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigService } from "./services/config.service";

import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetViewComponent } from './pages/dataset-view/dataset-view.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: 'datasets', component: DatasetListComponent },

  { path: 'datasets/:id', component: DatasetViewComponent },

  { path: '', pathMatch: "full", redirectTo: 'datasets' }
];

export function initConfig(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initConfig,
    deps: [ConfigService],
    multi: true
  }]
})
export class AppRoutingModule { }
