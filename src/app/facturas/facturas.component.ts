import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { FacturaService } from './services/facturas.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemFactura } from './models/item-factura';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva factura';
  factura: Factura = new Factura();

  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private facturaService: FacturaService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = +params.get('clienteId');
      this.clienteService.getCliente(clienteId).subscribe(cliente => {
        this.factura.cliente = cliente;
      })
    })

    this.productosFiltrados = this.autoCompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value: value.nombre),
        flatMap(value => value ? this._filter(value): [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string | undefined {
    return producto? producto.nombre: undefined;
  }
  
  seleccionarProducto(event: MatAutocompleteSelectedEvent) {
    let producto = event.option.value as Producto;
    
    let nuevoItem = new ItemFactura();
    nuevoItem.producto = producto;
    this.factura.items.push(nuevoItem);
    
    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }
}
