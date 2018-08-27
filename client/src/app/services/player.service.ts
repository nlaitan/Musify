import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
//import { Playlist } from '../models/playlist';
//import { Song } from '../models/song';

export interface IMedia {
    id: string;
    name: string;
    artist: string;
    src: string;
    type: string;
}

@Injectable()
export class PlayerService {
    public url: string;
    constructor(
        //private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
  addToQueue(song){
    let file_path = this.url + 'get-song-file/' + song.file;
    var song_play : IMedia = ({
            id: song._id,
            name: song.name,
            artist: song.album.artist.name,
            src: file_path,
            type: 'audio/mpeg'
        });

        var subQueue = JSON.parse(localStorage.getItem("queue"));
        if(!subQueue) {
          subQueue = [];
        }
      subQueue.push(song_play);
      localStorage.setItem('queue', JSON.stringify(subQueue));
  }

  addAlbumToQueue(songs){
      localStorage.setItem('queue', JSON.stringify([]));
      localStorage.setItem('newQueue', 'true');
    for (var i = 0; i < songs.length; ++i) {
      this.addToQueue(songs[i]);
    }
    this.basicStartPlayer(songs[0]);
  }

  startPlayer(song){
    this.basicStartPlayer(song);
    this.addToQueue(song);
  }

  basicStartPlayer(song){
    let song_player = JSON.stringify(song);
    let file_path = this.url + 'get-song-file/' + song.file;
    let image_path = this.url + 'get-image-album/' + song.album.image;
    
    localStorage.setItem('sound_song', song_player );
    document.getElementById("audio_source").setAttribute("src", file_path);
    (document.getElementById("myAudio") as any).load();
    (document.getElementById("myAudio") as any).play();

    document.getElementById("song-title").innerHTML = (song.album.artist.name + ' - ' + song.name);
    document.getElementById("play-image-album").setAttribute("src", image_path);
  }

}