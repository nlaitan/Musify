import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Playlist } from '../models/playlist';

@Injectable()
export class PlaylistService {
    public url: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
    addPlaylist(token, playlist: Playlist){
       let params = JSON.stringify(playlist);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.post(this.url + 'playlist', params, {headers: headers}).pipe(map(res => res));
    }

    editPlaylist(token, id: string, playlist: Playlist){
       let params = JSON.stringify(playlist);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.put(this.url + 'playlist/' + id, params, {headers: headers}).pipe(map(res => res));
    }

    getPlaylist(token, id: string){
        let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
        });

        return this._http.get(this.url + 'playlist/' + id, {headers: headers}).pipe(map(res => res));
    }

    getPlaylists(token, userId = null){
      let headers = new HttpHeaders({
         'Content-Type':'application/json',
         'Authorization': token
      });

      if(userId == null) {
        return this._http.get(this.url + 'playlists', {headers: headers}).pipe(map(res => res));
      } else {
        return this._http.get(this.url + 'playlists/' + userId, {headers: headers}).pipe(map(res => res));
      }
   
    }

    deletePlaylist(token, id: string){
      const options = { 
          headers: new HttpHeaders({
             'Content-Type':'application/json',
             'Authorization': token
          })
      };

      return this._http.delete(this.url + 'playlist/' + id, options).pipe(map(res => res));
    }

    addSong(token, id: string, playlist: Playlist){
      let params = JSON.stringify(playlist);
      const options = { 
          headers: new HttpHeaders({
             'Content-Type':'application/json',
             'Authorization': token
          })
      };

      return this._http.put(this.url + 'add-song-playlist/' + id, params, options).pipe(map(res => res));
    }

    deleteSong(token, id: string, playlist: Playlist){
      let params = JSON.stringify(playlist);
      const options = { 
          headers: new HttpHeaders({
             'Content-Type':'application/json',
             'Authorization': token
          })
      };

      return this._http.put(this.url + 'delete-song-playlist/' + id, params, options).pipe(map(res => res));
    }

}