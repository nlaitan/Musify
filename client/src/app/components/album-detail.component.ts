import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
	selector: 'album-detail',
	templateUrl: '../views/album-detail.html',
	providers: [ UserService, AlbumService ]
})

export class AlbumDetailComponent implements OnInit {
	public album: Album;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public albums: Album[];
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
        public app: AppComponent
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
	}

	ngOnInit(){
		this.getAlbum();
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
						// Obtener albums del artista
						this._albumService.getAlbums(this.token, response['entityName']._id).subscribe(
							response => {
								if(!response['entityName']){
									console.log('Este artista no tiene albums');
								} else {
									this.albums = response['entityName'];
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
	                if(error != null){
	                    this.errorMessage = error.error.message;
	                    console.log(this.errorMessage);
	                }
	            }
			);
		});
		
	}


}