import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()
export class ArtistService {
    public url: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
    addArtist(token, artist: Artist){
       let params = JSON.stringify(artist);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.post(this.url + 'artist', params, {headers: headers}).pipe(map(res => res));
    }

    editArtist(token, id: string, artist: Artist){
       let params = JSON.stringify(artist);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.put(this.url + 'artist/' + id, params, {headers: headers}).pipe(map(res => res));
    }

    getArtists(token, page){
        let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
        });
        
        return this._http.get(this.url + 'artists/' + page, {headers: headers}).pipe(map(res => res));
    }

    getArtist(token, id: string){
        let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
        });

        return this._http.get(this.url + 'artist/' + id, {headers: headers}).pipe(map(res => res));
    }

    deleteArtist(token, id: string){
      const options = { 
          headers: new HttpHeaders({
             'Content-Type':'application/json',
             'Authorization': token
          })
      };

      return this._http.delete(this.url + 'artist/' + id, options).pipe(map(res => res));
    }

}