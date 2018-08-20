import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { PlaylistService } from '../services/playlist.service';
import { GLOBAL } from '../services/global';
import { Playlist } from '../models/playlist';

@Component({
	selector: 'playlist-add',
	templateUrl: '../views/playlist-add.html',
	providers: [ UserService, PlaylistService ]
})

export class PlaylistAddComponent implements OnInit {
	public titulo: string;
	public playlist: Playlist;
	public submitName: string;
	public identity;
	public token;
	public url: string;
	public errorMessage;
	public is_create: boolean;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _playlistService: PlaylistService
	){
		this.titulo = 'Crear nueva playlist',
		this.submitName = 'Guardar playlist',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.playlist = new Playlist('', '', '', '', []);
	}

	ngOnInit(){
		console.log('playlist-add.component.ts cargado');
		this.playlist['user'] = this.identity._id;
	}


	onSubmit(){
		this._playlistService.addPlaylist(this.token, this.playlist).subscribe(
			response => {
				if(!response['entityName']){
					this.errorMessage = 'Error en el servidor';
					console.log(this.errorMessage);
				} else {
					this.playlist = response['entityName'];
					this._router.navigate(['/editar-playlist/', response['entityName']._id]);
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
