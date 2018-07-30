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
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

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
    // Usuario
    { path: 'mis-datos', component: UserEditComponent },
    { path: '**', component: HomeComponent },
    { path: '', component: HomeComponent }
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
