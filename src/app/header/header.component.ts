import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  title:string = 'App angular';

  constructor(private authService: AuthService
              ,private router: Router) {
  }

  logout():void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
