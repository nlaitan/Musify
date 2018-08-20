import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { AppComponent } from '../app.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';



@Component({
	selector: 'player',
	templateUrl: '../views/player.html'
})

export class PlayerComponent implements OnInit {
	public url: string;
	public song;
	

	constructor(
        public app: AppComponent,
        private _sanitizer: DomSanitizer
	){
		this.url = GLOBAL.url;
	}
	
	ngOnInit(){
		console.log('player.component.ts cargado');
		var song = JSON.parse(localStorage.getItem('sound_song'));
		
		if(song) {
			this.song = song;
			let song_player = JSON.stringify(song);
			let file_path = this.url + 'get-song-file/' + song.file;
			document.getElementById("audio_source").setAttribute("src", file_path);
		} else {
			this.song = new Song(1, '', '', '', '', '');
		}
	}

	getPlayerStyle(){
		if(!this.app.isSidenavClosed()){
			let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			width = width - 341;	// 250 de sidenav + 70 de imagen album
			let style = `width: ` + width + `px;`;
			return this._sanitizer.bypassSecurityTrustStyle(style); 
		} else {
			return this._sanitizer.bypassSecurityTrustStyle(`width: 100%;`);
		}
	}


	getSongInfoStyle() {
		var style;
		if (this.isSmallScreen()) {
			style = `margin-left: 0px; `;
		}
		if(!this.app.isSidenavClosed()){
			let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			width = width - 331;	// 250 de sidenav + 70 de imagen album
			style = style + `width: ` + width + `px;`;
			return this._sanitizer.bypassSecurityTrustStyle(style); 
		} else {
			style = style + `width: 100%;`;
			return this._sanitizer.bypassSecurityTrustStyle(style);
		}
	}

	getPlayButtonStyle() {
		if (!this.isSmallScreen()) {
			var timelineWidth = document.getElementById('scrub-bar-width').clientWidth;
			var marginLeft = (timelineWidth / 2) + 43;
			return this._sanitizer.bypassSecurityTrustStyle(`left: ` + marginLeft + `px;`);
		}
	}

    isSmallScreen() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (width < 600) {
            return true;
        } else {
            return false;
        }
    }

}