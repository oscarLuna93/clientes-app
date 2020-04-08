import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'inicia sesion por favor';
  usuario: Usuario;
  constructor(private authService: AuthService
            ,private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if(this.authService.isAuthenticated()) {
      this.router.navigate(['/clientes']);
    }
  }

  login():void {
    console.log(this.usuario);
    if ((this.usuario.username == null || this.usuario.password == null)
        || (this.usuario.username == '' || this.usuario.password == '')) {
      Swal.fire('Error login', 'Usuario o contraseña vacias!', 'error');
      return;
    }
    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let usuario = this.authService.usuario;
      this.router.navigate(['/clientes']);
      Swal.fire('Login', `Hola ${usuario.username},  has iniciado sesion con exito!`, 'success');
    }, error => {
      if (error.status == 400) {
        Swal.fire('Error en Login', 'Usuario o contraseña incorrectas', 'error');
      }
    });
  }
}