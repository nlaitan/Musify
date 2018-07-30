import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Album } from '../models/album';

@Injectable()
export class AlbumService {
    public url: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
    addAlbum(token, album: Album){
       let params = JSON.stringify(album);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.post(this.url + 'album', params, {headers: headers}).pipe(map(res => res));
    }

    editAlbum(token, id: string, album: Album){
       let params = JSON.stringify(album);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.put(this.url + 'album/' + id, params, {headers: headers}).pipe(map(res => res));
    }

    getAlbum(token, id: string){
        let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
        });

        return this._http.get(this.url + 'album/' + id, {headers: headers}).pipe(map(res => res));
    }

    getAlbums(token, artistId = null){
      let headers = new HttpHeaders({
         'Content-Type':'application/json',
         'Authorization': token
      });

      if(artistId == null) {
        return this._http.get(this.url + 'albums', {headers: headers}).pipe(map(res => res));
      } else {
        return this._http.get(this.url + 'albums/' + artistId, {headers: headers}).pipe(map(res => res));
      }
   
    }

    deleteAlbum(token, id: string){
      const options = { 
          headers: new HttpHeaders({
             'Content-Type':'application/json',
             'Authorization': token
          })
      };

      return this._http.delete(this.url + 'album/' + id, options).pipe(map(res => res));
    }

}