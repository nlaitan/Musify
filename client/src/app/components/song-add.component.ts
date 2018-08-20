import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { SongService } from '../services/song.service';

import { GLOBAL } from '../services/global';
import { AppComponent } from '../app.component';

import { Album } from '../models/album';
import { Song } from '../models/song';

//declare let $: any;

@Component({
	selector: 'song-add',
	templateUrl: '../views/song-add.html',
	providers: [ UserService, AlbumService, SongService ]
})

export class SongAddComponent implements OnInit {
	public titulo: string;
	public song: Song;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public album: Album;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _albumService: AlbumService,
		private _songService: SongService,

        public app: AppComponent
	){
		this.titulo = 'Agregar canción',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.song = new Song(1,'','','','','');
		
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
					//console.log(response);
					if(!response['entityName']){
						this.errorMessage = 'Error en el servidor';
						console.log(this.errorMessage);
					} else {
						this.song = response['entityName'];
						this._router.navigate(['/editar-cancion', response['entityName']._id]);	
						this.app.openSnackBar('Canción creada correctamente', '', 'green-snackbar');
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

}