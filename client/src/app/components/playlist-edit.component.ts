import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { Playlist } from '../models/playlist';
import { PlaylistService } from '../services/playlist.service';
import { UploadService } from '../services/upload.service';

@Component({
	selector: 'playlist-edit',
	templateUrl: '../views/playlist-add.html',
	providers: [ UserService, PlaylistService, UploadService ]
})

export class PlaylistEditComponent implements OnInit {
	public titulo: string;
	public submitName: string;
	public playlist: Playlist;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public is_edit;
	public filesToUpload: Array<File>;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _playlistService: PlaylistService,
		private _uploadService: UploadService, 
        public app: AppComponent
	){
		this.titulo = 'Editar playlist',
		this.submitName = 'Editar playlist',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.playlist = new Playlist('', '', '', '', []);
		this.is_edit = true;
	}

	ngOnInit(){
		this.getPlaylist();
	}

	onSubmit(){
		this._route.params.forEach((params: Params)=> {
			let id = params['id'];

			this._playlistService.editPlaylist(this.token, id, this.playlist).subscribe(
				response => {
					if(!response['entityName']){
						this.errorMessage = 'Error en el servidor';
						this.app.openSnackBar(this.errorMessage, '', 'red-snackbar');
					} else {
						
						this._uploadService.makeFileRequest(
							this.url + 'upload-image-playlist/' + id, 
							[], this.filesToUpload, this.token, 'image'
						).then(
							(result) => {
								// redeirigir a playlist-detail
								//this._router.navigate(['/playlist', response['entityName'].id]);
								this.app.openSnackBar('Playlist editada correctamente', '', 'green-snackbar');
							},
							(error) => {
								// redeirigir a playlist-detail
								//this._router.navigate(['/playlist', response['entityName'].id]);
								this.app.openSnackBar('Playlist editada correctamente (sin imagen)', '', 'green-snackbar');
							}
						);
					}
				},
				error => {
	                if(error != null){
	                    console.log(this.errorMessage);
	                }
	            }	
			);

		});
	}

	getPlaylist(){
		this._route.params.forEach((params: Params)=> {	
			let id = params['id'];
			this._playlistService.getPlaylist(this.token, id).subscribe(
				response => {
					if(!response['playlist']){
						this._router.navigate(['/']);
					} else {
						this.playlist = response['playlist'];
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