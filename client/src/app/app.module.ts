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

// AUDIO PLAYER
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

import { 
  MatButtonModule, MatCardModule, MatExpansionModule, 
  MatIconModule, MatListModule, MatPaginatorModule, MatTableModule,
  MatInputModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule
  } from '@angular/material';

// ----- MIS COMPONENTS ----- //

import { UserEditComponent } from './components/user-edit.component';

// ARTIST
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

// ALBUM
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

// SONG
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';
import { PlayerComponent } from './components/player.component';

import { HomeComponent } from './components/home.component';


@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    // ARTIST
    ArtistListComponent, ArtistAddComponent, ArtistEditComponent, ArtistDetailComponent,
    // ALBUM
    AlbumAddComponent, AlbumEditComponent, AlbumDetailComponent,
    // SONG
    SongAddComponent, SongEditComponent,
    PlayerComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxPopper,
    MaterializeModule,
    VgCoreModule, VgControlsModule, VgBufferingModule, VgOverlayPlayModule,

    // ANGULAR MATERIAL //
    MatButtonModule, MatCardModule, MatExpansionModule,
    MatIconModule, MatListModule, MatPaginatorModule, MatTableModule,
    MatInputModule, MatSidenavModule, MatSnackBarModule, MatTooltipModule,
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
