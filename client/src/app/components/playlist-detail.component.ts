import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

import { AppComponent } from '../app.component';
import { Playlist } from '../models/playlist';
import { Song } from '../models/song';

import { PlaylistService } from '../services/playlist.service';
import { SongService } from '../services/song.service';
import { PlayerService } from '../services/player.service';


@Component({
	selector: 'playlist-detail',
	templateUrl: '../views/playlist-detail.html',
	providers: [ UserService, PlaylistService, SongService, PlayerService ]
})

export class PlaylistDetailComponent implements OnInit {
	public playlist: Playlist;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public songs: Song[];
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _playlistService: PlaylistService,
		private _songService: SongService,
		private _playerService: PlayerService,
        public app: AppComponent
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		this.getPlaylist();
	}

	getPlaylist(){
		
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._playlistService.getPlaylist(this.token, id).subscribe(
				response => {
					!response['playlist'] ? 
						console.log('no hay playlist') :
						this.playlist = response['playlist'];
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

	deleteSong(song){
		this._playlistService.deleteSong(this.token, song, this.playlist).subscribe(
			response => {
				this.getPlaylist();
			},
			error => {
                if(error != null){
                    console.log(error);
                }
            }
		);
	}
	
	addPlaylistToQueue(){
    	this._playerService.addAlbumToQueue(this.playlist['songs'])
	}

	startPlayer(song){
		this._playerService.startPlayer(song);
	}

}