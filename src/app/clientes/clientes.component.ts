import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.js';
import { ClienteService } from './cliente.service.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{
  clientes: Cliente[];

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    let page = 0;
    this.clienteService.getClientes(page).subscribe(
      response => this.clientes = response.content as Cliente[]
    );
  }

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Cliente ${cliente.nombre} + ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar cliente!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.deleteCliente(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(client => client !== cliente)
            Swal.fire(
              'Eliminado!',
              `El cliente ${cliente.nombre} ha sido eliminado.`,
              'success'
            )
          }
        )
      }
    })
  }
}
