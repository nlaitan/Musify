import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { PlaylistService } from '../services/playlist.service';
import { SongService } from '../services/song.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { Playlist } from '../models/playlist';
import { Song } from '../models/song';

export interface IMedia {
    id: string;
    name: string;
    artist: string;
    src: string;
    type: string;
}

@Component({
	selector: 'playlist-detail',
	templateUrl: '../views/playlist-detail.html',
	providers: [ UserService, PlaylistService, SongService ]
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
        public app: AppComponent
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		this.getPlaylist();
		//console.log(this.identity);
	}

	getPlaylist(){
		
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._playlistService.getPlaylist(this.token, id).subscribe(
				response => {
					!response['playlist'] ? 
						this._router.navigate(['/']) :
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
    	localStorage.setItem('queue', JSON.stringify([]));
		for (var i = 0; i < this.playlist['songs'].length; ++i) {
			this.addToQueue(this.playlist['songs'][i]);
		}
		this.basicStartPlayer(this.playlist['songs'][0]);
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

}