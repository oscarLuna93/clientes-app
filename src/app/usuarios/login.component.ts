import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'inicia sesion por favor';
  usuario: Usuario;
  constructor() {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  login():void {
    console.log(this.usuario);
    if ((this.usuario.username == null || this.usuario.password == null)
        || (this.usuario.username == '' || this.usuario.password)) {
      Swal.fire('Error login', 'Usuario o contraseña vacias!', 'error');
      return;
    }
  }
}