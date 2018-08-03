import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Song } from '../models/song';

@Injectable()
export class SongService {
    public url: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
    addSong(token, song: Song){
       let params = JSON.stringify(song);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.post(this.url + 'song', params, {headers: headers}).pipe(map(res => res));
    }

    getSong(token, id: string){
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.get(this.url + 'song/' + id, {headers: headers}).pipe(map(res => res));
    }

    getSongs(token, albumId = null){
      let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': token
      });

      if(albumId == null) {
          return this._http.get(this.url + 'songs', {headers: headers}).pipe(map(res => res));
      } else {
          return this._http.get(this.url + 'songs/' + albumId, {headers: headers}).pipe(map(res => res));
      }
    
    }

    editSong(token, id:string, song: Song){
      let params = JSON.stringify(song);
      let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': token
      });

      return this._http.put(this.url + 'song/'+id, params, {headers: headers}).pipe(map(res => res));
    }

    deleteSong(token, id:string){
      let headers = new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization': token
      });

      return this._http.delete(this.url + 'song/'+id, {headers: headers}).pipe(map(res => res));
    }

}