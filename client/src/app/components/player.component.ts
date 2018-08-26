import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { GLOBAL } from '../services/global';
import { Song } from '../models/song';
import { AppComponent } from '../app.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { VgAPI } from 'videogular2/core';
import { SongService } from '../services/song.service';
import { UserService } from '../services/user.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations'

export interface IMedia {
    id: string;
    name: string;
    artist: string;
    src: string;
    type: string;
}


@Component({
	selector: 'player',
	templateUrl: '../views/player.html',
	providers: [ SongService, UserService ],
	animations: [
		trigger('stateAnimation', [
			state('hidden', style({
	            opacity: 0,
	            transform: 'translateY(100%)',
	        })),
	        state('visible', style({
	            opacity: 1,
	            transform: 'translateY(0%)',
	        })),
	        transition('hidden => visible', animate('400ms ease-in', keyframes([
	          style({opacity: 0, transform: 'translateY(75%)', offset: 0}),
	          style({opacity: 0.1, transform: 'scale(1, 0.2)', offset: 0.2}),
	          style({opacity: 0.5, transform: 'translateY(-35px)',  offset: 0.5}),
	          style({opacity: 0.9, transform: 'scale(1, 1)', offset: 0.8}),
	          style({opacity: 1, transform: 'translateY(0)', offset: 1.0})
	        ]))),
	        transition('visible => hidden', animate('250ms ease-out', keyframes([
	          style({opacity: 1, transform: 'translateY(0)', offset: 0}),
	          style({opacity: 0.9, transform: 'scale(1, 1)', offset: 0.2}),
	          style({opacity: 0.5, transform: 'translateY(-35px)',  offset: 0.5}),
	          style({opacity: 0.2, transform: 'scale(1, 0.2)', offset: 0.8}),
	          style({opacity: 0, transform: 'translateY(75%)', offset: 1})
	        ]))),
	    ]),
	]
})

export class PlayerComponent implements OnInit {
	public url: string;
	public song;
	public queue: Array<IMedia> = [];
	public api: VgAPI;
	public audiosrc;
	public token;
 	public currentIndex = 0;
    public currentItem: IMedia = this.queue[ this.currentIndex ];
    public state: string = 'hidden';

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
        public app: AppComponent,
        private _sanitizer: DomSanitizer,
        private _songService : SongService,
        private _userService : UserService
	){
		this.url = GLOBAL.url;
		this.token = this._userService.getToken();
	}
	
	ngOnInit(){
		var song = JSON.parse(localStorage.getItem('sound_song'));
		var subQueue = JSON.parse(localStorage.getItem('queue'));
		song ? (this.song = song) :
				this.song = new Song('', '', '', '', '');
		subQueue ? (this.queue = subQueue) :
					console.log('no hay queue');
		
		let file_path = this.url + 'get-song-file/' + this.song.file;
        this.audiosrc = file_path;
        this.currentIndex = this.queue.length - 1;
	}

	addToQueue(song){
		this.queue.push(song);
	}

    onPlayerReady(api: VgAPI) {
        this.api = api;

        this.api.getDefaultMedia().subscriptions.ended.subscribe(
        	this.nextSong.bind(this)
        );
        this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(() => {
            let subQueue = JSON.parse(localStorage.getItem("queue"));
            if(!(this.queue.length === subQueue.length)) {
            	this.queue = JSON.parse(localStorage.getItem("queue"));
            	this.currentIndex = this.queue.length - 1;
            }
        });
        
    }

    emptyQueue(){
    	this.queue = [];
    	localStorage.setItem('queue', JSON.stringify(this.queue));
    }

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex === this.queue.length) {
            this.currentIndex = 0;
        }
        this.currentItem = this.queue[ this.currentIndex ];
        this.getSong(this.currentItem.id);
        this.audiosrc = this.currentItem.src;
		(document.getElementById("myAudio") as any).load();
		(document.getElementById("myAudio") as any).play();
		document.getElementById("song-title").innerHTML = (this.currentItem.artist + ' - ' + this.currentItem.name);
    
    }

    prevSong() {
        this.currentIndex--;

        if (this.currentIndex === -1) {
            this.currentIndex = this.queue.length-1;
        }
        this.currentItem = this.queue[ this.currentIndex ];
        this.getSong(this.currentItem.id);
        this.audiosrc = this.currentItem.src;
		(document.getElementById("myAudio") as any).load();
		(document.getElementById("myAudio") as any).play();	
		document.getElementById("song-title").innerHTML = (this.currentItem.artist + ' - ' + this.currentItem.name);
    }

    onClickPlaylistItem(item: IMedia, index: number) {
        this.currentIndex = index;
        this.currentItem = item;
		this.getSong(this.currentItem.id);
        this.audiosrc = this.currentItem.src;
		(document.getElementById("myAudio") as any).load();
		(document.getElementById("myAudio") as any).play();
		document.getElementById("song-title").innerHTML = (this.currentItem.artist + ' - ' + this.currentItem.name);

    }

	getPlayerStyle(){
		var number = 255;
		if(!this.isSmallScreen()) {
			number = number + 80;
		}
		if(!this.app.isSidenavClosed()){
			let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
			width = width - number;	// 250 de sidenav + 70 de imagen album
			let style = `width: ` + width + `px;`;
			return this._sanitizer.bypassSecurityTrustStyle(style); 
		} else {
			return this._sanitizer.bypassSecurityTrustStyle(`width: 100%;`);
		}
	}

	getSong(id){
		this._route.params.forEach((params: Params)=> {	
			this._songService.getSong(this.token, id).subscribe(
				response => {
					if(!response['entityName']){
						console.log('no hay cancion');
					} else {
						this.song = response['entityName'];
						let song_player = JSON.stringify(this.song);
        				localStorage.setItem('sound_song', song_player );
        				let file_path = this.url + 'get-song-file/' + this.song.file;
        				this.audiosrc = file_path;
        				//console.log(this.song);
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

	getButtonStyle(number) {
		var timelineWidth = document.getElementById('scrub-bar-width').clientWidth;
		if (this.isSmallScreen()) {
			number = number - 75;
			document.getElementById('view-queue').setAttribute('style', 'margin-left: 40px;');
			document.getElementById('empty-queue').setAttribute('style', 'margin-left: 90px;');	
		} 
		if(!this.app.isSidenavClosed()){
			number = number + 30;	
		}
		var marginLeft = (timelineWidth / 2) +  number;
		return this._sanitizer.bypassSecurityTrustStyle(`left: ` + marginLeft + `px;`);

	}
	
	openQueue(){
		this.state = (this.state === 'hidden' ? 'visible' : 'visible');
	}

	closeQueue(){	
		this.state = (this.state === 'visible' ? 'hidden' : 'hidden');
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