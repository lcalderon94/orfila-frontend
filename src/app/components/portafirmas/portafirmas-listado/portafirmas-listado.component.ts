import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef } from '@angular/material/dialog';

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
    this.dataSource = new MatTableDataSource<DocumentoFirma>(this.getDatosIniciales());
  }

  ngOnInit() {}

  cerrarDialog(): void {
    this.dialogRef.close();
  }

  private getDatosIniciales(): DocumentoFirma[] {
    return [
      {
        aplicacion: 'IMLZ',
        titulo: 'DocumentoTextoLibre165753333329-Lopez-Santiago-02003379/9900001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-07-11')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'DocumentoTextoLibre165563820014-Caruso-Damiano-',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-06-28')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'InformeRemisionDeMuestras165640682927-Lopez-Santiago-02003379/9900001',
        tramitador: 'Álvarez Córdoba, Todo',
        estado: 'Pendiente de firma',
        progreso: '0/2',
        fechaAlta: new Date('2022-06-01')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'SeñalamientoReconocimiento165354357234-Luis-Luis-02003770000001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-05-26')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'CarnetdeconsultaI65434534637-Lopez-Santiago-02003379/9900001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-05-25')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'CarnetdeconsultaI653438478005-Lopez-Santiago-02003379/9900001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-05-25')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'ModificacionFechaCitacionI65343517906-Lopez-Santiago-02003379/9900001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-05-25')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'CarnetdeconsultaI65341917915-Lopez-Santiago-02003379/9900001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-05-25')
      },
      {
        aplicacion: 'IMLZ',
        titulo: 'AcusederecibodepeticionpericialI65334104448-Lopez-Santiago-02003379/9900001',
        tramitador: 'ARANDA RAMIREZ, CAROLINA',
        estado: 'Pendiente de firma',
        progreso: '0/1',
        fechaAlta: new Date('2022-05-25')
      }
    ];
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