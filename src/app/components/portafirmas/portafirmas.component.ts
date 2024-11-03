import { Component } from '@angular/core';

@Component({
  selector: 'app-portafirmas',
  templateUrl: './portafirmas.component.html',
  styleUrls: ['./portafirmas.component.css']
})
export class PortafirmasComponent {
  mostrarListado: boolean = false;

  abrirPortafirmas(): void {
    this.mostrarListado = true;
  }
}