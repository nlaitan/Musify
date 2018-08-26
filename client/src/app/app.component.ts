import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
//import { Http } from '@angular/http';
import  { MatSnackBar } from '@angular/material';
declare let $: any;
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
    public shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
    public title = 'Listen';
    public user: User;
    public user_register: User;
    public identity;
    public token;
    public errorMessage;
    public alertRegister;
    public successRegister;
    public url: string;
    public closed: boolean;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        public snackBar: MatSnackBar,
        private _sanitizer: DomSanitizer
    ) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        this.url = GLOBAL.url;
    }
    
    ngOnInit(){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.closed = true;
    }
    
    yesClosed() {
        this.closed = true;
    }

    isSidenavClosed(){
        return this.closed;
    }

    noClosed() {
        this.closed = false;
    }

    public onSubmit() {
        // Conseguir los datos del usuario
        this._userService.signup(this.user).subscribe(
            response => {
                let identity = response['user'];
                this.identity = identity;
                if(!this.identity._id){
                    alert("El usuario no está correctamente identificado");
                } else {
                    // elemento en localStorage para tener el usuario en sesión
                    localStorage.setItem('identity', JSON.stringify(identity));
                    
                    this._userService.signup(this.user, 'true').subscribe(
                        response => {
                            let token = response['token'];
                            this.token = token;
                            if(this.token.length <= 0){
                                alert("El token no se ha generado");
                            } else {
                                // elemento en localStorage para tener el token en sesión
                                localStorage.setItem('token', token);
                                this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                                this.openSnackBar('Usuario logueado', '', 'green-snackbar');
                                this.roundAvatar();
                            }
                        },
                        error => {
                            if(error != null){
                                this.errorMessage = error.error.message;
                            }
                        }
                    );
                }
            },
            error => {
                if(error != null){
                    this.errorMessage = error.error.message;
                    console.log(error);
                }
            }
        );
    }
    
    logout() {
        localStorage.removeItem('identity');
        localStorage.removeItem('token');
        localStorage.clear();
        this.identity = null;
        this.token = null;
        this._router.navigate(['/']);
    }
    
    onSubmitRegister(){
        console.log(this.user_register);
        this._userService.register(this.user_register).subscribe(
            response => {
                let user = response['entityName'];
                this.user_register = user;
                if(!user._id){
                    this.alertRegister = 'Error al registrarse';
                } else {
                    this.successRegister = 'El registro se ha realizado correctamente,                     inicie sesión con: ' + this.user_register.email;
                    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
                }
            },
            error => {
                if(error != null){
                    this.alertRegister = error.error.message;
                    console.log(error);
                }
            }
        );
    }
    
    openSnackBar(message: string, action: string, classPanel: string) {
        this.snackBar.open(message, action, {
            duration: 1000,
            panelClass: [ classPanel ]
        });
    }

    isLargeScreen() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (width > 720) {
            return true;
        } else {
            return false;
        }
    }

    roundAvatar() {
        var img = document.getElementById("image_cover");        
        var imageWidth = img.clientWidth;
        var imageHeight = img.clientHeight;
        if(imageWidth > imageHeight){
            document.getElementById("image_cover").style.width = 'auto';
            document.getElementById("image_cover").style.height = '100%';
        }else{
            document.getElementById("image_cover").style.width = '100%';
            document.getElementById("image_cover").style.height = 'auto';
        }
    };

    search(event){
        this._router.navigate(['/busqueda']);
        if (document.getElementById('term-search')) {
            document.getElementById('term-search').setAttribute('value',event.target.value);
        }
        if(document.getElementById("button-search")){
            document.getElementById("button-search").click();  
        }
    }


}
