import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
    public title = 'Listen';
    public user: User;
    public user_register: User;
    public identity;
    public token;
    public errorMessage;
    public alertRegister;
    public successRegister;
    public url: string;
    constructor(
        private _userService: UserService
    ) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
        this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        this.url = GLOBAL.url;
    }
    
    ngOnInit(){
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
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
    
}
