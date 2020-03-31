import { Injectable } from '@angular/core';
import { Cliente } from './cliente.js';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { map, tap, catchError } from 'rxjs/operators'
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

  getClientes(page: number): Observable<any> {
    return this.http.get(this.URL_ENDPOINT + '/page/' + page).pipe(
      tap((response: any) => {
        console.log("primer tap");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map((response:any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log("segundo tap");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        })
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.URL_ENDPOINT, cliente, {headers: this.httpHeaders})
      .pipe(
        map((response :any) => response.cliente as Cliente),
        catchError(e => {

          if (e.status == 400) {
            return throwError(e);
          }

          console.log('Error : ' + e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error,'error');
          
          return throwError(e);
        })
      );
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

  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.URL_ENDPOINT}/${cliente.id}`, cliente, {headers: this.httpHeaders})
      .pipe(
        catchError(e => {

          if (e.status == 400) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');
          
          return throwError(e);
        })
      );
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.URL_ENDPOINT}/${id}`, {headers: this.httpHeaders})
      .pipe(
        catchError(e => {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');

          return throwError(e);
        })
      );
  }
}
