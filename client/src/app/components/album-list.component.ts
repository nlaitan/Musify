import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { AlbumService } from '../services/album.service';
import { GLOBAL } from '../services/global';
import { Album } from '../models/album';

@Component({
	selector: 'album-list',
	templateUrl: '../views/album-list.html',
	providers: [ UserService, AlbumService ]
})

export class AlbumListComponent implements OnInit {
	public titulo: string;
	public albums: Album[];
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
		private _albumService: AlbumService
	){
		this.titulo = 'Álbums',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.items_por_pagina = 4;
		this.next_page = 1;
		this.prev_page = 1;
	}

	ngOnInit(){
		console.log('album-list.component.ts cargado');
		// Conseguir listado de artistas
		this.getAlbums();
	}

	getAlbums(){
		this._route.params.forEach((params: Params) => {
			let page = +params['page'];
			if(!page) {
				page = 1;
			} else {
				this.next_page = page + 1;
				if (page == 1) {
					this.prev_page = page;	
				} else {
					this.prev_page = page - 1;
				}	
			};

			this._albumService.getAllAlbums(this.token, page).subscribe(
				response => {
					if(!response['entityName']) {
						this._router.navigate(['/']);
					} else {
						this.albums = response['entityName'];
					}
				},
				error => {
	                if(error != null){
	                    console.log(error);
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
				this.getAlbums();
			},
			error => {
                if(error != null){
                    console.log(error.error.message);
                }
            }
		);
	}

}