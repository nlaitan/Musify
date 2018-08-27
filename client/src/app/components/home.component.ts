import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
	selector: 'home',
	templateUrl: '../views/home.html',
	providers: [UserService]
})

export class HomeComponent implements OnInit {
	public titulo: string;
	public identity;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService
	){
		this.titulo = 'Bienvenido'
	}

	ngOnInit(){
		this.identity = this._userService.getIdentity();
		// Conseguir listado de artistas
	}

}