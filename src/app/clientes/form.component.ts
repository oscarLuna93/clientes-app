import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente()
  errors: String[];
  regiones: Region[];
  titulo: string = "Crear Cliente";

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    })
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

  compararRegion(region1: Region, region2: Region): boolean {
    if (region1 === undefined && region2 === undefined) {
      return true;
    }
    return region1 == null || region2 == null? false: region1.id === region2.id;
  }
}
