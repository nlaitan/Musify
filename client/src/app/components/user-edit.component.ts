import { Component, OnInit } from '@angular/core';
import { UserService} from '../services/user.service';
import { GLOBAL } from '../services/global';
import { User } from '../models/user';
import { MatSnackBar } from '@angular/material';
import { AppComponent } from '../app.component';


@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})


export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity;
    public token;
    public alertUpdate;
    public successUpdate;
    public url: string;
    
    constructor(
        private _userService: UserService,
        public app: AppComponent
    ){
        this.titulo = 'Actualizar mis datos';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this.identity;
        this.url = GLOBAL.url;
    }
    
    ngOnInit(){
        console.log('user-edit.component.ts cargado');
    }
    
    onSubmit(){    
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response['entityName']){
                    this.alertUpdate = 'El usuario no se ha actualizado';
                } else {
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById("userData").innerHTML = 
                                this.user.name + ' ' + this.user.lastname;

                    if(!this.filesToUpload){
                        // redirección
                    } else {
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filesToUpload).then(
                            (result: any) => {
                                this.user.image = result['image'];
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                console.log(this.user);
                                let image_path = this.url + 'get-image-user/' + this.user.image;
                                document.getElementById("image_cover").setAttribute('src', image_path);
                            });        
                    }
                    this.app.openSnackBar('Datos guardados correctamente', '', 'green-snackbar');
                    this.app.roundAvatar();
                }
            },
            error => {
                if(error != null){
                    let errorMessage = error.error.message;
                    this.app.openSnackBar(errorMessage, '', 'red-snackbar');
                }
            }
        );
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
    
    makeFileRequest(url:string, params:Array<string>, files: Array<File>){
        var token = this.token;

        return new Promise(function(resolve,reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();

            for(var i=0; i<files.length; i++){
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }  
                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);

        });
    }

}


