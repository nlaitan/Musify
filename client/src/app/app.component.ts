import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})

export class AppComponent implements OnInit {
    public title = 'Listen';
    public user: User;
    public identity;
    public token;
    public errorMessage;
    constructor(
        private _userService: UserService
    ) {
        this.user = new User('', '', '', '', '', 'ROLE_USER', '');
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
}
