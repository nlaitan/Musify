import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { UploadService } from '../services/upload.service';

@Component({
	selector: 'album-edit',
	templateUrl: '../views/album-add.html',
	providers: [ UserService, AlbumService, UploadService ]
})

export class AlbumEditComponent implements OnInit {
	public titulo: string;
	public album: Album;
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
		private _albumService: AlbumService,
		private _uploadService: UploadService, 
        public app: AppComponent
	){
		this.titulo = 'Editar álbum',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', 2018, '', '');
		this.is_edit = true;
	}

	ngOnInit(){
		//console.log('album-edit.component funcionando');
		this.getAlbum();
	}

	onSubmit(){
		this._route.params.forEach((params: Params)=> {
			let id = params['id'];

			this._albumService.editAlbum(this.token, id, this.album).subscribe(
				response => {
					if(!response['entityName']){
						this.errorMessage = 'Error en el servidor';
						this.app.openSnackBar(this.errorMessage, '', 'red-snackbar');
					} else {
						
						this._uploadService.makeFileRequest(
							this.url + 'upload-image-album/' + id, 
							[], this.filesToUpload, this.token, 'image'
						).then(
							(result) => {
								this._router.navigate(['/artista', response['entityName'].artist]);
								this.app.openSnackBar('Álbum editado correctamente', '', 'green-snackbar');
							},
							(error) => {
								this._router.navigate(['/artista', response['entityName'].artist]);
								this.app.openSnackBar('Álbum editado correctamente (sin imagen)', '', 'green-snackbar');
								//console.log(error);
							}
						);
					}
				},
				error => {
	                if(error != null){
	                    //this.errorMessage = error.error.message;
	                    console.log(this.errorMessage);
	                }
	            }	
			);

		});
	}

	getAlbum(){
		this._route.params.forEach((params: Params)=> {	
			let id = params['id'];
			this._albumService.getAlbum(this.token, id).subscribe(
				response => {
					//console.log(response);
					if(!response['entityName']){
						//this.errorMessage = 'Error en el servidor';
						this._router.navigate(['/']);
					} else {
						this.album = response['entityName'];
						//this._router.navigate(['/editar-album/', response['entityName']._id])	
					}
				},
				error => {
	                if(error != null){
	                    //this.errorMessage = error.error.message;
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