import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';
import { DOCUMENTOS_FIRMA_MOCK } from '../../../mock-data/portafirmas.mock';

interface DocumentoFirma {
  aplicacion: string;
  titulo: string;
  tramitador: string;
  estado: string;
  progreso: string;
  fechaAlta: Date;
  hasIcon?: boolean;
}

@Component({
  selector: 'app-portafirmas-listado',
  templateUrl: './portafirmas-listado.component.html',
  styleUrls: ['./portafirmas-listado.component.css']
})
export class PortafirmasListadoComponent implements OnInit {
  itemsPorPagina = 10;
  dataSource: MatTableDataSource<DocumentoFirma>;
  selection = new SelectionModel<DocumentoFirma>(true, []);

  columnasVisibles = [
    'select',
    'aplicacion',
    'titulo', 
    'tramitador',
    'estado',
    'progreso',
    'fechaAlta',
    'mark',
    'done',
    'acciones'
  ];

  constructor(public dialogRef: MatDialogRef<PortafirmasListadoComponent>) {
    this.dataSource = new MatTableDataSource<DocumentoFirma>(DOCUMENTOS_FIRMA_MOCK);
  }

  ngOnInit() {}

  cerrarDialog(): void {
    this.dialogRef.close();
  }

   /** Si todos los elementos están seleccionados */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selecciona/deselecciona todos los elementos */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** Etiqueta para el checkbox */
  checkboxLabel(row?: DocumentoFirma): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deseleccionar' : 'seleccionar'} todo`;
    }
    return `${this.selection.isSelected(row) ? 'deseleccionar' : 'seleccionar'} fila`;
  }

  /** Filtra los datos de la tabla */
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}