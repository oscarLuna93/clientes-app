import { Injectable } from '@angular/core';
import { Cliente } from './cliente.js';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private URL_ENDPOINT: string = "http://localhost:8080/api/clientes"
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient,
              private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.URL_ENDPOINT).pipe(
      map((response) => response as Cliente[])
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.URL_ENDPOINT, cliente, {headers: this.httpHeaders});
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.URL_ENDPOINT}/${id}`)
      .pipe(
        catchError(e => {
          this.router.navigate(['/clientes']);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          console.log(e.error.mensaje);
          
          return throwError(e);
        })
      );
  }

  updateCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.URL_ENDPOINT}/${cliente.id}`, cliente, {headers: this.httpHeaders});
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.URL_ENDPOINT}/${id}`, {headers: this.httpHeaders});
  }
}
