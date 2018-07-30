import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { GLOBAL } from '../services/global';
import { Artist } from '../models/artist';
declare var Materialize: any;
//declare let $: any;

@Component({
	selector: 'artist-add',
	templateUrl: '../views/artist-add.html',
	providers: [ UserService, ArtistService ]
})

export class ArtistAddComponent implements OnInit {
	public titulo: string;
	public artist: Artist;
	public identity;
	public token;
	public url: string;
	public errorMessage;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _artistService: ArtistService
	){
		this.titulo = 'Crear nuevo artista',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.artist = new Artist('', '', '');
	}

	ngOnInit(){
		console.log('artist-add.component.ts cargado');
		Materialize.updateTextFields();
		//$(.agregar).addClass('active');
	}


	onSubmit(){
		this._artistService.addArtist(this.token, this.artist).subscribe(
			response => {
				if(!response['entityName']){
					this.errorMessage = 'Error en el servidor';
					console.log(this.errorMessage);
				} else {
					this.artist = response['entityName'];
					this._router.navigate(['/editar-artista/', response['entityName']._id])	
				}
			},
			error => {
                if(error != null){
                    this.errorMessage = error.error.message;
                    console.log(this.errorMessage);
                }
            }				
		);
	}

}
