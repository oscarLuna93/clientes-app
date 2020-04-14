import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private URL_ENDPOINT: string = 'http://localhost:4200/facturas'

  constructor(private http: HttpClient) { }

  getFactura(id:number): Observable<Factura> {
    return this.http.get<Factura>(`${this.URL_ENDPOINT}/${id}`);
  }
}
