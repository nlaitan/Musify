import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

import { Song } from '../models/song';
import { Album } from '../models/album';
import { Artist } from '../models/artist';
import { Playlist } from '../models/playlist';

import { SongService } from '../services/song.service';
import { AlbumService } from '../services/album.service';
import { ArtistService } from '../services/artist.service';
import { PlaylistService } from '../services/playlist.service';
import { PlayerService } from '../services/player.service';


@Component({
	selector: 'search',
	templateUrl: '../views/search.html',
	providers: [ 
		UserService, SongService, AlbumService, ArtistService, PlayerService, PlaylistService
	]
})

export class SearchComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public next_page;
	public prev_page;
	public termi;

	public songs: Song[];
	public albums: Album[];
	public artists: Artist[];
	public playlists: Playlist[];
	

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService,
		private _albumService: AlbumService,
		private _artistService: ArtistService,
		private _playlistService: PlaylistService,
		private _playerService: PlayerService
		
	){
		this.titulo = 'Búsqueda',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.next_page = 1;
		this.prev_page = 1;
		//this.searchedText = localStorage.getItem('searchedText');
		
	}

	ngOnInit(){
		console.log('search.component.ts cargado');
		//this.searchedText = localStorage.getItem('searchedText');
		this.getSongs();
		this.getAlbums();
		this.getArtists();
		this.getPlaylists();

	}


	getSongs(){
				
		this._route.params.forEach((params: Params) => {	
			this._songService.getSongs(this.token).subscribe(
				response => {
					if(!response['entityName']){
						console.log('Este album no tiene canciones');
					} else {
						this.songs = response['entityName'];
						console.log(this.songs);
					}
				},
				error => {
	                if(error != null){
	                    console.log(error.error.message);
	                }
	            }
			)						
		})
	
	}

	getAlbums(){
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page) {
				page = 1;
			} else {
				this.next_page = page + 1;
				if (page == 1) {
					this.prev_page = page;	
				} else {
					this.prev_page = page - 1;
				}	
			};

			this._albumService.getAllAlbums(this.token, page).subscribe(
				response => {
					if(!response['entityName']) {
						console.log('no hay albums');
					} else {
						this.albums = response['entityName'];
						//console.log(this.albums);
					}
				},
				error => {
	                if(error != null){
	                    console.log(error);
	                }
	            }
			); 

		});
	}
	
	getArtists(){
		this._route.params.forEach((params: Params) => {
			let page = 1;
			if(!page) {
				page = 1;
			} else {
				this.next_page = page + 1;
				if (page == 1) {
					this.prev_page = page;	
				} else {
					this.prev_page = page - 1;
				}	
			};

			this._artistService.getArtists(this.token, page).subscribe(
				response => {
					if(!response['artists']) {
						console.log('no hay artistas');
					} else {
						this.artists = response['artists'];
					}
				},
				error => {
	                if(error != null){
	                    console.log(error.error.message);
	                }
	            }
			); 

		});
	}

	changeTerm(event){
		this.termi = document.getElementById('term-search').getAttribute('value');

		(document.getElementById('albums-id')) ?
			document.getElementById('empty-albums').setAttribute('hidden', '') :
			document.getElementById('empty-albums').removeAttribute('hidden');

		(document.getElementById('artists-id')) ?
			document.getElementById('empty-artists').setAttribute('hidden', '') :
			document.getElementById('empty-artists').removeAttribute('hidden');

		if (document.getElementById('songs-id')) { 
			document.getElementById('empty-songs').setAttribute('hidden', '');
			document.getElementById('songs-table').removeAttribute('hidden')
		} else {
			document.getElementById('empty-songs').removeAttribute('hidden');
			document.getElementById('songs-table').setAttribute('hidden', '');
		}
	}

	addAlbumToQueue(songs){
		this._playerService.addAlbumToQueue(songs);
	}

	startPlayer(song){
		this._playerService.startPlayer(song);
	}

	addSongToPlaylist(playlist_id, song){

		this._playlistService.addSong(this.token, song, playlist_id).subscribe(
			response => {
				this.getPlaylists();
			},
			error => {
                if(error != null){
                    console.log(error);
                }
            }
		);
	
	}

	getPlaylists(){
		this._route.params.forEach((params: Params) => {
			var myId = this.identity._id;
			this._playlistService.getPlaylists(this.token, myId).subscribe(
				response => {
					if(!response['entityName']) {
						console.log('No hay playlists');
					} else {
						this.playlists = response['entityName'];
					}
				},
				error => {
	                if(error != null){
	                    console.log(error.error.message);
	                }
	            }
			); 

		});
	}

	getAndPlayAlbum(album_id){
		this._route.params.forEach((params: Params) => {		
			this._songService.getSongs(this.token, album_id).subscribe(
				response => {
					if(!response['entityName']){
						console.log('Este album no tiene canciones');
					} else {
						var songs = response['entityName'];
						this._playerService.addAlbumToQueue(songs);
					}
				},
				error => {
	                if(error != null){
	                    console.log(error.error.message);
	                }
	            }
			);
		});
	}

}