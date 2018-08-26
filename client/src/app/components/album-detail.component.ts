import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { PlaylistService } from '../services/playlist.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { PlayerComponent } from './player.component';
//import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
import { Playlist } from '../models/playlist';


export interface IMedia {
    id: string;
    name: string;
    artist: string;
    src: string;
    type: string;
}

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [ UserService, AlbumService, SongService, PlaylistService, PlayerComponent ]
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
        public app: AppComponent,
        public player: PlayerComponent
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

	addToQueue(song){
		let file_path = this.url + 'get-song-file/' + song.file;
		var song_play : IMedia = ({
            id: song._id,
            name: song.name,
            artist: song.album.artist.name,
            src: file_path,
            type: 'audio/mpeg'
        });

        var subQueue = JSON.parse(localStorage.getItem("queue"));
        if(!subQueue) {
        	subQueue = [];
        }
    	subQueue.push(song_play);
    	localStorage.setItem('queue', JSON.stringify(subQueue));
	}

	addAlbumToQueue(){
    	localStorage.setItem('queue', JSON.stringify([]));
    	localStorage.setItem('newQueue', 'true');
		for (var i = 0; i < this.songs.length; ++i) {
			this.addToQueue(this.songs[i]);
		}
		this.basicStartPlayer(this.songs[0]);
	}

	startPlayer(song){
		this.basicStartPlayer(song);
		this.addToQueue(song);
	}

	basicStartPlayer(song){
		let song_player = JSON.stringify(song);
		let file_path = this.url + 'get-song-file/' + song.file;
		let image_path = this.url + 'get-image-album/' + song.album.image;
		
		localStorage.setItem('sound_song', song_player );
		document.getElementById("audio_source").setAttribute("src", file_path);
		(document.getElementById("myAudio") as any).load();
		(document.getElementById("myAudio") as any).play();

		document.getElementById("song-title").innerHTML = (song.album.artist.name + ' - ' + song.name);
		document.getElementById("play-image-album").setAttribute("src", image_path);

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

