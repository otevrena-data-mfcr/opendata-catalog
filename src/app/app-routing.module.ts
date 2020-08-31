import { NgModule, APP_INITIALIZER } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigService } from "./services/config.service";
import { HttpClientModule } from '@angular/common/http';

import { DatasetListComponent } from './pages/dataset-list/dataset-list.component';
import { DatasetViewComponent } from './pages/dataset-view/dataset-view.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

import { IriGuard } from './guards/iri.guard';
import { IdentifierGuard } from './guards/identifier.guard';

const routes: Routes = [
  { path: 'datasets', component: DatasetListComponent },
  { path: 'datasets/:iri', component: DatasetViewComponent },

  { path: 'identifier/:identifier', canActivate: [IdentifierGuard], children: [] },
  { path: 'iri/:iri', canActivate: [IriGuard], children: [] },

  { path: 'not-found', component: NotFoundComponent },

  { path: '', pathMatch: "full", redirectTo: 'datasets' },
  { path: '**', pathMatch: "full", redirectTo: 'not-found' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
