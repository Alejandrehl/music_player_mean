import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{
  public title = '¡Shake It!';
  public user: User;
  public identity;
  public token;
  public errorMessage;

  constructor(private _userService: UserService){
  	this.user = new User('','','','','','ROLE_USER','');
  }

  //Metodo para cargar metodos o lo que sea al refrescar la página
  public ngOnInit(){

  }

  public onSubmit(){
  	console.log(this.user);

    //Conseguir los datos del usuario identificado
    this._userService.signup(this.user).subscribe(response => {
      console.log(response);

      let identity = response.user;
      this.identity = identity;
      if(!this.identity){
        alert('El usuario no esta correctamente identificado');
      }else{
        //Crear elemento en el localstorage para tener al usuario en sesión

        //Conseguir el token para enviarselo a cada petición http
          this._userService.signup(this.user, 'true').subscribe(response => {
            console.log(response);

            let token = response.token;
            this.token = token;
            if(this.token.length <= 0){
              alert('El token no se ha generado');
            }else{
              //Crear elemento en el localstorage para tener token disponibel
              
              console.log(token);
              console.log(identity);
            }
            
          },
          error => {
            var errorMessage = <any>error;
            if(errorMessage != null){
              var body = JSON.parse(error._body);
              this.errorMessage = body.message;
              console.log(error);
            }
          });
      }
      
    },
    error => {
      var errorMessage = <any>error;
      if(errorMessage != null){
        var body = JSON.parse(error._body);
        this.errorMessage = body.message;
        console.log(error);
      }
    });
  }

}
