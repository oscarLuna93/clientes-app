import { Injectable } from '@angular/core';
import { Cliente } from './cliente.js';
import { Observable, of, throwError} from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http'
import { map, tap, catchError } from 'rxjs/operators'
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Region } from './region';
import { AuthService } from '../usuarios/auth.service.js';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private URL_ENDPOINT: string = "http://localhost:8080/api/clientes"
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) { }

  private agregarHeaderAuthorization() {
    let token = this.authService.token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    } else {
      return this.httpHeaders;
    }
  }

  private isNotAutorizated(e): boolean {
    if (e.status == 401) {
      if (this.authService.isAuthenticated()) {
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if (e.status == 403) {
      Swal.fire('Acceso Denegado', `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`, 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.URL_ENDPOINT + '/regiones', {headers: this.agregarHeaderAuthorization()}).pipe(
      catchError(e => {
        this.isNotAutorizated(e);
        return throwError(e);
      })
    );
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
    return this.http.post(this.URL_ENDPOINT, cliente, {headers: this.agregarHeaderAuthorization()})
      .pipe(
        map((response :any) => response.cliente as Cliente),
        catchError(e => {

          if (this.isNotAutorizated(e)) {
            return throwError(e);
          }

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
    return this.http.get<Cliente>(`${this.URL_ENDPOINT}/${id}`, {headers: this.agregarHeaderAuthorization()})
      .pipe(
        catchError(e => {

          if (this.isNotAutorizated(e)) {
            return throwError(e);
          }

          this.router.navigate(['/clientes']);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          console.log(e.error.mensaje);
          
          return throwError(e);
        })
      );
  }

  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.URL_ENDPOINT}/${cliente.id}`, cliente, {headers: this.agregarHeaderAuthorization()})
      .pipe(
        catchError(e => {

          if (this.isNotAutorizated(e)) {
            return throwError(e);
          }

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
    return this.http.delete<Cliente>(`${this.URL_ENDPOINT}/${id}`, {headers: this.agregarHeaderAuthorization()})
      .pipe(
        catchError(e => {
          if (this.isNotAutorizated(e)) {
            return throwError(e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, 'error');

          return throwError(e);
        })
      );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if(token != null) {
      httpHeaders = httpHeaders.append('Authorization', 'Bearer' + token);
    }

    const req = new HttpRequest('POST', `${this.URL_ENDPOINT}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    })

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNotAutorizated(e);
        return throwError(e);
      })
    );
  }
}
