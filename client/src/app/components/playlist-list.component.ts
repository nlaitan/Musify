import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Playlist } from '../models/playlist';
import { PlaylistService } from '../services/playlist.service';

@Component({
	selector: 'playlist-list',
	templateUrl: '../views/playlist-list.html',
	providers: [ UserService, PlaylistService ]
})

export class PlaylistListComponent implements OnInit {
	public titulo: string;
	public playlists: Playlist[];
	public identity;
	public token;
	public url: string;
	public next_page;
	public prev_page;
	public items_por_pagina;
	public confirmado;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _playlistService: PlaylistService
	){
		this.titulo = 'Playlists',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.items_por_pagina = 4;
		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit(){
		console.log('playlist-list.component.ts cargado');
		// Conseguir listado de artistas
		this.getPlaylists();
	}

	getPlaylists(){
		this._route.params.forEach((params: Params) => {
			var myId = this.identity._id;
			this._playlistService.getPlaylists(this.token, myId).subscribe(
				response => {
					if(!response['entityName']) {
						this._router.navigate(['/']);
					} else {
						this.playlists = response['entityName'];
						//console.log(this.playlists);
					}
				},
				error => {
	                if(error != null){
	                    console.log(error.error.message);
	                }
	            }
			); 

		});
	}

	onDeleteConfirm(id){
		this.confirmado = id;
	}

	onCancelPlaylist(){
		this.confirmado = null;
	}

	onDeletePlaylist(id){
		this._playlistService.deletePlaylist(this.token, id).subscribe(
			response => {
				if(!response['playlist']) {
					alert('Error en el servidor');
				}
				this.getPlaylists();
			},
			error => {
                if(error != null){
                    console.log(error.error.message);
                }
            }
		);
	}

}