import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.js';
import { ClienteService } from './cliente.service.js';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService
              ,private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
    let page:number = +params.get('page');
    if(!page) {
      page = 0;
    }

    this.clienteService.getClientes(page)
    .subscribe(response => {
      this.clientes = response.content as Cliente[];
      this.paginador = response;
      });
    });
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

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }
}
