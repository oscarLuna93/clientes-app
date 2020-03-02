import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent {
  listaCurso:string[] = ['TypeScript', 'JavaScrip', 'Java SE', 'Spring']
  habilitar:boolean = true;

  setHabilitar():void {
    this.habilitar = (this.habilitar==true) ? false:true
  }
}
