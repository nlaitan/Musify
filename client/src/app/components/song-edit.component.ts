import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';
import { VgAPI } from 'videogular2/core';

import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';

import { Album } from '../models/album';
import { Song } from '../models/song';

@Component({
	selector: 'song-edit',
	templateUrl: '../views/song-add.html',
	providers: [ UserService, AlbumService, SongService, UploadService ]
})

export class SongEditComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public album: Album;
	public is_edit;
	public filesToUpload: Array<File>;
	public audio_duration;
	public audiosrc;
	public api: VgAPI;
	public audiotype = "audio/mpeg";

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
		private _uploadService: UploadService,

        public app: AppComponent
	){
		this.titulo = 'Editar canción',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song('','','','','');
		this.is_edit = true;
		
	}

	ngOnInit(){
		console.log('song-edit.component funcionando');
		this.getSong();
		//this.getDuration();
	}

	onSubmit(){
		
		this._route.params.forEach((params: Params)=> {
			let id = params['id'];

			this._songService.editSong(this.token, id, this.song).subscribe(
				response => {
					//console.log(response);
					if(!response['entityName']){
						console.log('Error en el servidor');
					} else {
						if (!this.filesToUpload){
							this._router.navigate(['/album', response['entityName'].album]);
							this.app.openSnackBar('Canción editada (sin audio subido)', '', 'green-snackbar');	
						} else {
							this._uploadService.makeFileRequest(
								this.url + 'upload-file-song/' + id, 
								[], this.filesToUpload, this.token, 'file'
							).then(
								(result) => {
									this._router.navigate(['/album', response['entityName'].album]);	
									this.app.openSnackBar('Canción editada correctamente', '', 'green-snackbar');
								},
								(error) => {
									console.log(error);
								}
							);							
						}
	
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

 	fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

	getSong(){
		this._route.params.forEach((params: Params)=> {	
			let id = params['id'];
			this._songService.getSong(this.token, id).subscribe(
				response => {
					if(!response['entityName']){
						this._router.navigate(['/']);
					} else {
						this.audiosrc = this.url + 'get-song-file/' + response['entityName'].file;
						this.song = response['entityName'];
					}
				},
				error => {
	                if(error != null){
	                    console.log(error.error.message);
	                }
	            }
	        )
		});
	}

	getAudioDuration(time){
		var minutes = Math.floor(time / 60000);
		var seconds = Math.floor((time % 60000) / 1000).toFixed(0);
		var finalTime = minutes + ":" + (parseInt(seconds,10) < 10 ? '0' : '') + seconds;
		return finalTime;
	}

	onPlayerReady(api:VgAPI){
		document.getElementById("songEditSrc").setAttribute("src", this.audiosrc);
		this.api = api;
		this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
			this.song['duration'] = this.getAudioDuration(this.api.time.total);
	    });	
	}

}