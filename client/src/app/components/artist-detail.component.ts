import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';
import { Artist } from '../models/artist';
import { Album } from '../models/album';

@Component({
	selector: 'artist-detail',
	templateUrl: '../views/artist-detail.html',
	providers: [ UserService, ArtistService, AlbumService ]
})

export class ArtistDetailComponent implements OnInit {
	public artist: Artist;
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
		private _artistService: ArtistService,
		private _albumService: AlbumService,
        public app: AppComponent
	){
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
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

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelAlbum(){
		this.confirmado = null;
	}

	onDeleteAlbum(id){
		this._albumService.deleteAlbum(this.token, id).subscribe(
			response => {
				if(!response['album']) {
					alert('Error en el servidor');
				}
				this.getArtist();
			},
			error => {
                if(error != null){
                    console.log(error.error.message);
                }
            }
		);
	}

}