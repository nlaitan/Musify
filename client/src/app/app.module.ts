import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPopper } from 'angular-popper';
import { HttpClientModule } from '@angular/common/http';
import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import 'hammerjs';
import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { 
  MatButtonModule, MatCardModule, MatExpansionModule,
  MatIconModule, MatListModule, MatPaginatorModule,
  MatInputModule, MatSidenavModule, MatSnackBarModule
  } from '@angular/material';

// ----- MIS COMPONENTS ----- //

import { UserEditComponent } from './components/user-edit.component';

// ARTIST
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

//ALBUM
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

import { HomeComponent } from './components/home.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxPopper,
    MaterializeModule,

    // ANGULAR MATERIAL //
    MatButtonModule, MatCardModule, MatExpansionModule,
    MatIconModule, MatListModule, MatPaginatorModule,
    MatInputModule, MatSidenavModule, MatSnackBarModule,
    BrowserAnimationsModule,
    // FIN ANGULAR MATERIAL //

    routing,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
