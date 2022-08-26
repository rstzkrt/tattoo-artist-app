import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CreateArtistPageComponent } from './components/create-artist-page/create-artist-page.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSliderModule} from "@angular/material/slider";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {FlexLayoutModule} from "@angular/flex-layout";
// import {FlexLayout} from "@angular/flex-layout";

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    CreateArtistPageComponent,
    ArtistProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSliderModule,
    MatPaginatorModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    FlexLayoutModule,
    // FlexLayout

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
