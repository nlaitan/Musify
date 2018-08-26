import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';
import { UploadService } from '../services/upload.service';

import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';

import { Album } from '../models/album';
import { Song } from '../models/song';

//declare let $: any;

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [ UserService, AlbumService, SongService, UploadService ]
})

export class SongAddComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public filesToUpload: Array<File>;
	public album: Album;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,
		private _uploadService: UploadService,

        public app: AppComponent
	){
		this.titulo = 'Agregar canción',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song('','','','','');
		
	}

	ngOnInit(){
		console.log('song-add.component funcionando');
		this.getAlbum();
	}

	onSubmit(){
		
		this._route.params.forEach((params: Params)=> {
			let album_id = params['album'];
			this.song['album'] = album_id;

			this._songService.addSong(this.token, this.song).subscribe(
				response => {
					if(!response['entityName']){
						console.log('Error en el servidor');
					} else {
						if (!this.filesToUpload){
							this._router.navigate(['/editar-cancion', response['entityName']._id]);
							this.app.openSnackBar('Canción guardada (sin audio subido)', '', 'green-snackbar');	
						} else {
							this._uploadService.makeFileRequest(
								this.url + 'upload-file-song/' + response['entityName']._id, 
								[], this.filesToUpload, this.token, 'file'
							).then(
								(result) => {		
									this._router.navigate(['/editar-cancion', response['entityName']._id]);		
									this.app.openSnackBar('Canción guardada correctamente', '', 'green-snackbar');
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
	                    //this.errorMessage = error.error.message;
	                    console.log(error.error.message);
	                }
	            }	
			);
		});
		
	}

	getAlbum(){
		this._route.params.forEach((params: Params)=> {	
			let album_id = params['album'];
			this._albumService.getAlbum(this.token, album_id).subscribe(
				response => {
					if(!response['entityName']){
						console.log('Error en el response');
					} else {
						this.album = response['entityName'];
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

	fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}