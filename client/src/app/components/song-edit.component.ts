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
	public filesrc;
	public audiosrc;
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
		this.song = new Song(1,'','','','','');
		this.is_edit = true;
		
	}

	ngOnInit(){
		console.log('song-edit.component funcionando');
		this.getSong();
	}

	onSubmit(){
		
		this._route.params.forEach((params: Params)=> {
			let id = params['id'];

			this._songService.editSong(this.token, id, this.song).subscribe(
				response => {
					console.log(response);
					if(!response['entityName']){
						console.log('Error en el servidor');
					} else {
						//this.song = response['entityName'];
						//this._router.navigate(['/album/', response['entityName']._id]);
						if (!this.filesToUpload){
							this._router.navigate(['/editar-cancion', response['entityName']._id]);
							this.app.openSnackBar('Canción editada (sin audio subido)', '', 'green-snackbar');	
						} else {
							this._uploadService.makeFileRequest(
								this.url + 'upload-file-song/' + id, 
								[], this.filesToUpload, this.token, 'file'
							).then(
								(result) => {
									this._router.navigate(['/editar-cancion', response['entityName']._id]);	
									this.app.openSnackBar('Canción editada correctamente', '', 'green-snackbar');
								},
								(error) => {
									//this._router.navigate(['/artista', response['entityName'].artist]);
									console.log(error);
								}
							);							
						}
	
						//this.app.openSnackBar('Canción editada!', '', 'green-snackbar');
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
						//this._router.navigate(['/editar-album/', response['entityName']._id])	
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

}