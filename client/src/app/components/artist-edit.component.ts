import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { Artist } from '../models/artist';

@Component({
	selector: 'artist-edit',
	templateUrl: '../views/artist-add.html',
	providers: [ UserService, ArtistService, UploadService ]
})

export class ArtistEditComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
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
		private _artistService: ArtistService,
        private _uploadService: UploadService, 
        public app: AppComponent
	){
		this.titulo = 'Editar artista',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '');
		this.is_edit = true;
	}

	ngOnInit(){
		this.getArtist();
	}

	getArtist(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];
			this._artistService.getArtist(this.token, id).subscribe(
				response => {
					if(!response['entityName']) {
						this._router.navigate(['/']);
					} else {
						this.artist = response['entityName'];
						console.log(this.artist);	
					}
				},
				error => {
	                if(error != null){
	                    this.errorMessage = error.error.message;
	                    console.log(this.errorMessage);
	                }
	            }
			);
		});
	}

	onSubmit(){
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistService.editArtist(this.token, id, this.artist).subscribe(
				response => {
					
					if(!response['entityName']){
						this.errorMessage = 'Error en el servidor';
						console.log(this.errorMessage);
					} else {
						if(!this.filesToUpload){
							this._router.navigate(['/artista', response['entityName']._id]);
							this.app.openSnackBar('Datos guardados (sin imagen)', '', 'yellow-snackbar');
						} else {
		                    this._uploadService.makeFileRequest(
								this.url + 'upload-image-artist/' + id, 
								[], this.filesToUpload, this.token, 'image'
							).then(
								(result) => {
									this._router.navigate(['/artista', response['entityName']._id]);
									this.app.openSnackBar('Datos guardados correctamente', '', 'green-snackbar');
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
	                    this.errorMessage = error.error.message;
	                    console.log(this.errorMessage);
	                }
	            }				
			)
		});
	}

    
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

}