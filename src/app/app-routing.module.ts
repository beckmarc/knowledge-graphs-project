import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtDetailViewComponent } from './components/art-detail-view/art-detail-view.component';
import { MuseumDetailComponent } from './components/museum-detail/museum-detail.component';
import { MuseumOverviewComponent } from './components/museum-overview/museum-overview.component';

const routes: Routes = [
  {
    path: 'museums',
    component: MuseumOverviewComponent,
  },
  {
    path: 'museums/:id',
    component: MuseumDetailComponent
  },
  {
    path: 'museums/:museumId/art/:id',
    component: ArtDetailViewComponent
  },
  {
    path: '**',
    redirectTo: 'museums'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
