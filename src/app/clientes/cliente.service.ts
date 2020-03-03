import { Injectable } from '@angular/core';
import { Cliente } from './cliente.js';
import { CLIENTES } from './clientes.json';
import { Observable, of} from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private URL_ENDPOINT: string = "http://localhost:8080/api/clientes"
  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.URL_ENDPOINT).pipe(
      map((response) => response as Cliente[])
    );
  }
}
