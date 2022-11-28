import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MuseumOverviewComponent } from './components/museum-overview/museum-overview.component';
// Import HttpClientModule from @angular/common/http
import {HttpClientModule} from '@angular/common/http';
import { QueryService } from './services/query.service';
import {MatCardModule} from '@angular/material/card';
import { MuseumDetailComponent } from './components/museum-detail/museum-detail.component';
import { RouterModule } from '@angular/router';
import { ArtDetailViewComponent } from './components/art-detail-view/art-detail-view.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatSelectModule} from '@angular/material/select';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    MuseumOverviewComponent,
    MuseumDetailComponent,
    ArtDetailViewComponent
  ],
  imports: [
    MatCardModule,
    MatSliderModule,
    NgxSliderModule,
    MatButtonModule,
    BrowserModule,
    MatSelectModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    QueryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
