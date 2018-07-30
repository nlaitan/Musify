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
	selector: 'album-add',
	templateUrl: '../views/album-add.html',
	providers: [ UserService, ArtistService, AlbumService ]
})

export class AlbumAddComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
	public album: Album;
	public identity;
	public token;
	public url: string;
	public errorMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService,
		private _albumService: AlbumService,
        public app: AppComponent
	){
		this.titulo = 'Crear nuevo álbum',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.album = new Album('', '', 2018, '', '');
	}

	ngOnInit(){
		console.log('album-add.component funcionando')
	}

	onSubmit(){
		this._route.params.forEach((params: Params)=> {
			let artist_id = params['artist'];
			this.album['artist'] = artist_id;

			this._albumService.addAlbum(this.token, this.album).subscribe(
				response => {
					//console.log(response);
					if(!response['entityName']){
						this.errorMessage = 'Error en el servidor';
						console.log(this.errorMessage);
					} else {
						this.artist = response['entityName'];
						this._router.navigate(['/editar-album/', response['entityName']._id])	
						this.app.openSnackBar('Álbum creado correctamente', '', 'green-snackbar');
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
		console.log(this.album);
	}

}