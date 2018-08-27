import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';

import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { PlaylistService } from '../services/playlist.service';
import { PlayerService } from '../services/player.service';

import { Album } from '../models/album';
import { Song } from '../models/song';
import { Playlist } from '../models/playlist';


@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [ UserService, AlbumService, SongService, PlaylistService, PlayerService ]
})

export class AlbumDetailComponent implements OnInit {
	public album: Album;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public albums: Album[];
	public playlists: Playlist[];
	public songs: Song[];
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
		private _playlistService: PlaylistService,
		private _playerService: PlayerService,
        public app: AppComponent
        //public player: PlayerComponent
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		this.getAlbum();
		this.getPlaylists();
	}

	getAlbum(){
		
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					if(!response['entityName']) {
						this._router.navigate(['/']);
					} else {
						this.album = response['entityName'];
						// Obtener canciones del album
						
						this._songService.getSongs(this.token, response['entityName']._id).subscribe(
							response => {
								if(!response['entityName']){
									console.log('Este album no tiene canciones');
								} else {
									this.songs = response['entityName'];
								}
							},
							error => {
				                if(error != null){
				                    console.log(error.error.message);
				                }
				            }
						);
						
					}
				},
				error => {
					var errorMessage = <any>error;
	                if(errorMessage != null){
	                	var body = JSON.parse(error._body);
	                    console.log(error.error.message);
	                }
	            }
			);
		});
		
	}

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelSong(){
		this.confirmado = null;
	}

	onDeleteSong(id){
		this._songService.deleteSong(this.token, id).subscribe(
			response => {
				if(!response['entityName']) {
					alert('Error en el servidor');
				}
				this.getAlbum();
			},
			error => {
                if(error != null){
                    console.log(error.error.message);
                }
            }
		);
	}

	addAlbumToQueue(){
    	this._playerService.addAlbumToQueue(this.songs);
	}

	startPlayer(song){
		this._playerService.startPlayer(song);
	}

	getPlaylists(){
		this._route.params.forEach((params: Params) => {
			var myId = this.identity._id;
			this._playlistService.getPlaylists(this.token, myId).subscribe(
				response => {
					if(!response['entityName']) {
						this._router.navigate(['/']);
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

}

