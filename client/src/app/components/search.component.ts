import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';

import { Song } from '../models/song';
import { Album } from '../models/album';
import { Artist } from '../models/artist';

import { SongService } from '../services/song.service';
import { AlbumService } from '../services/album.service';
import { ArtistService } from '../services/artist.service';


@Component({
	selector: 'search',
	templateUrl: '../views/search.html',
	providers: [ 
		UserService, SongService, AlbumService, ArtistService
	]
})

export class SearchComponent implements OnInit {
	public titulo: string;
	public identity;
	public token;
	public url: string;
	public next_page;
	public prev_page;
	public termi;

	public songs: Song[];
	public albums: Album[];
	public artists: Artist[];
	

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _songService: SongService,
		private _albumService: AlbumService,
		private _artistService: ArtistService
		
	){
		this.titulo = 'Búsqueda',
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.next_page = 1;
		this.prev_page = 1;
		//this.searchedText = localStorage.getItem('searchedText');
		
	}

	ngOnInit(){
		console.log('search.component.ts cargado');
		//this.searchedText = localStorage.getItem('searchedText');
		this.getSongs();
		this.getAlbums();
		this.getArtists();

	}


	getSongs(){

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
						console.log('no hay albums');
					} else {
						this.albums = response['entityName'];
						//console.log(this.albums);
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
	
	getArtists(){
		this._route.params.forEach((params: Params) => {
			let page = 1;
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

			this._artistService.getArtists(this.token, page).subscribe(
				response => {
					if(!response['artists']) {
						console.log('no hay artistas');
					} else {
						this.artists = response['artists'];
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

	changeTerm(event){
		this.termi = document.getElementById('term-search').getAttribute('value');
	}

}