import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html'
})
export class DetalleComponent implements OnInit {
  cliente: Cliente;
  titulo: string = "Detalle del cliente";

  private fotoSeleccionada: File;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get('id');
      
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image')) {
      Swal.fire('Error: ', 'Debes seleccionar un archivo de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      Swal.fire('Error: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(cliente => {
        this.cliente = cliente;
        Swal.fire('La foto se ha subido correctamente', `La foto se ha subido con exito: ${this.cliente.foto}`, 'success');
      });
    }
  }

}
