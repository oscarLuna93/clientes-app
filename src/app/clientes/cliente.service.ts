import { Injectable } from '@angular/core';
import { Cliente } from './cliente.js';
import { CLIENTES } from './clientes.json';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private URL_ENDPOINT: string = "http://localhost:8080/api/clientes"
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.URL_ENDPOINT).pipe(
      map((response) => response as Cliente[])
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.URL_ENDPOINT, cliente, {headers: this.httpHeaders});
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.URL_ENDPOINT}/${id}`);
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.URL_ENDPOINT}/${cliente.id}`, cliente, {headers: this.httpHeaders});
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.URL_ENDPOINT}/${id}`, {headers: this.httpHeaders});
  }
}
