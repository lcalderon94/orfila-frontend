import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PortafirmasListadoComponent } from './portafirmas-listado/portafirmas-listado.component';

@Component({
  selector: 'app-portafirmas',
  templateUrl: './portafirmas.component.html',
  styleUrls: ['./portafirmas.component.css']
})
export class PortafirmasComponent {
  mostrarListado: boolean = false;  // Añadimos esta línea

  constructor(private dialog: MatDialog) {}

  abrirPortafirmas(): void {
    const dialogRef = this.dialog.open(PortafirmasListadoComponent, {
      width: '90%',
      height: '90%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'portafirmas-dialog'
    });

    // Opcional: manejar el cierre del diálogo
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se ha cerrado');
    });
  }
}