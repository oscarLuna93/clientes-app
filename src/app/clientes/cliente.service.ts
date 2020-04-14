import { Injectable } from '@angular/core';
import { Cliente } from './cliente.js';
import { Observable, throwError} from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http'
import { map, tap, catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { Region } from './region';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private URL_ENDPOINT: string = "http://localhost:8080/api/clientes"

  constructor(private http: HttpClient,
              private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.URL_ENDPOINT + '/regiones');
  }
  
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
    return this.http.post(this.URL_ENDPOINT, cliente)
      .pipe(
        map((response :any) => response.cliente as Cliente),
        catchError(e => {

          if (e.status == 400) {
            return throwError(e);
          }

          console.log('Error : ' + e.error.mensaje);
          
          return throwError(e);
        })
      );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.URL_ENDPOINT}/${id}`)
      .pipe(
        catchError(e => {
          if (e.status != 401 && e.error.mensaje) {
            this.router.navigate(['/clientes']);  
          }
          this.router.navigate(['/clientes']);
          return throwError(e);
        })
      );
  }

  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.URL_ENDPOINT}/${cliente.id}`, cliente)
      .pipe(
        catchError(e => {
          if (e.status == 400) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.URL_ENDPOINT}/${id}`)
      .pipe(
        catchError(e => {
          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.URL_ENDPOINT}/upload`, formData, {
      reportProgress: true
    })

    return this.http.request(req);
  }
}