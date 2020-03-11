import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente()
  private titulo: string = "Crear Cliente";

  private errors: String[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        Swal.fire('Nuevo cliente', `Cliente ${cliente.nombre} creado`, 'success');
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors)
      }
      )
  }

  cargarCliente(): void {
    this.activatedRouter.params.subscribe(params => {
      let id = params['id'];
      if(id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente);
      }
    })
  }

  update(): void {
    this.clienteService.updateCliente(this.cliente)
      .subscribe(response => {
        this.router.navigate(['/clientes']);
        Swal.fire('Cliente Actualizado', `${response.mensaje}: ${response.cliente.nombre}`, 'success');
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error(err.error.errors)
      })
  }

}
