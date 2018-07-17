import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class UserService {
    public url: string;
    public identity;
    public token;
    constructor(
        private _http: HttpClient
    ) {
        this.url = GLOBAL.url; 
    }  
    
    signup(user_to_login, gethash = null) {
        if(gethash != null) {
            user_to_login.gethash = gethash;
        }
        
        let json = JSON.stringify(user_to_login);
        let params = json;
        
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        
        return this._http.post(this.url + 'login', params, {headers: headers}).pipe(map(res => res));
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        
        if(identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        
        return this.identity;
    }
    
    getToken() {
        let token = localStorage.getItem('token');
        
        if(token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        
        return this.token;
    }
    
}