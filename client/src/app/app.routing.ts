import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// ----- MIS COMPONENTS ----- //

import { UserEditComponent } from './components/user-edit.component';

// ARTISTA
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistListComponent } from './components/artist-list.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

// ALBUM
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumListComponent } from './components/album-list.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

// SONG
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

// PLAYLIST
import { PlaylistAddComponent } from './components/playlist-add.component';
import { PlaylistEditComponent } from './components/playlist-edit.component';
import { PlaylistListComponent } from './components/playlist-list.component';
import { PlaylistDetailComponent } from './components/playlist-detail.component';


import { HomeComponent } from './components/home.component';

const appRoutes: Routes = [
    // Artista
    { path: 'crear-artista', component: ArtistAddComponent },
    { path: 'editar-artista/:id', component: ArtistEditComponent },
    { path: 'artista/:id', component: ArtistDetailComponent },
    { path: 'artistas/:page', component: ArtistListComponent },
    // Álbum
    { path: 'crear-album/:artist', component: AlbumAddComponent },
    { path: 'editar-album/:id', component: AlbumEditComponent },
    { path: 'album/:id', component: AlbumDetailComponent },
    { path: 'all-albums/:page', component: AlbumListComponent },
    // Canción
    { path: 'crear-cancion/:album', component: SongAddComponent },
    { path: 'editar-cancion/:id', component: SongEditComponent },
    // Playlist
    { path: 'crear-playlist', component: PlaylistAddComponent },
    { path: 'editar-playlist/:id', component: PlaylistEditComponent },
    { path: 'playlists/:user?', component: PlaylistListComponent },
    { path: 'playlist/:id', component: PlaylistDetailComponent },

    
    // Usuario
    { path: 'mis-datos', component: UserEditComponent },
    { path: '**', component: HomeComponent },
    { path: '', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
