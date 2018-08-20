import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Genre } from '../models/genre';

@Injectable()
export class GenreService {
    public url: string;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
    addGenre(token, genre: Genre){
       let params = JSON.stringify(genre);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.post(this.url + 'genre', params, {headers: headers}).pipe(map(res => res));
    }

    editGenre(token, id: string, genre: Genre){
       let params = JSON.stringify(genre);
       let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
       });

       return this._http.put(this.url + 'genre/' + id, params, {headers: headers}).pipe(map(res => res));
    }

    getGenres(token, page){
        let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
        });
        
        return this._http.get(this.url + 'genres/' + page, {headers: headers}).pipe(map(res => res));
    }

    getGenre(token, id: string){
        let headers = new HttpHeaders({
           'Content-Type':'application/json',
           'Authorization': token
        });

        return this._http.get(this.url + 'genre/' + id, {headers: headers}).pipe(map(res => res));
    }

    deleteGenre(token, id: string){
      const options = { 
          headers: new HttpHeaders({
             'Content-Type':'application/json',
             'Authorization': token
          })
      };

      return this._http.delete(this.url + 'genre/' + id, options).pipe(map(res => res));
    }

}