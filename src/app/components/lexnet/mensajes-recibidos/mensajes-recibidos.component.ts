// mensajes-recibidos.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-mensajes-recibidos',
  templateUrl: './mensajes-recibidos.component.html',
  styleUrls: ['./mensajes-recibidos.component.css']
})
export class MensajesRecibidosComponent implements OnInit {
  mostrarFiltros = false;
  dataSource: MatTableDataSource<any>;
  itemsPorPagina = 10;

  filtros = {
    estado: 'todos',
    fechaConsultaDesde: null,
    fechaConsultaHasta: new Date('2022-08-09 08:58')
  };

  columnasVisibles = [
    'nMensaje',
    'tipoMensaje',
    'remitente',
    'asunto',
    'nAnio',
    'tipoProc',
    'fechaNotificacion',
    'opciones'
  ];

  columnasSinOpciones: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource();
    // Inicializa dataSource con datos de ejemplo
    this.dataSource.data = this.obtenerDatosDePrueba();

    // Filtramos las columnas para excluir 'opciones' al generar las columnas dinámicamente
    this.columnasSinOpciones = this.columnasVisibles.filter(col => col !== 'opciones');
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limpiarFiltros() {
    this.filtros = {
      estado: 'todos',
      fechaConsultaDesde: null,
      fechaConsultaHasta: new Date('2022-08-09 08:58')
    };
  }

  buscar() {
    console.log('Aplicando filtros:', this.filtros);
    // Implementa la lógica de búsqueda aquí
  }

  exportarWord() {
    console.log('Exportando a Word...');
  }

  exportarPDF() {
    console.log('Exportando a PDF...');
  }

  exportarExcel() {
    console.log('Exportando a Excel...');
  }

  verDetalle(elemento: any) {
    console.log('Detalle del elemento:', elemento);
    // Implementa la lógica para mostrar el detalle del mensaje
  }

  // Método para obtener datos de ejemplo
  obtenerDatosDePrueba(): any[] {
    return [
      {
        nMensaje: '202210195591960',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'CUA',
        fechaNotificacion: new Date('2022-08-04 09:15')
      },
      {
        nMensaje: '202210195591958',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ASS',
        fechaNotificacion: new Date('2022-08-04 09:11')
      },
      {
        nMensaje: '202210195591956',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ABS',
        fechaNotificacion: new Date('2022-08-04 08:57')
      },
      {
        nMensaje: '202210195591976',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ABS',
        fechaNotificacion: new Date('2022-07-26 09:12')
      },
      {
        nMensaje: '202210195591975',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ABS',
        fechaNotificacion: new Date('2022-07-26 09:11')
      },
      {
        nMensaje: '202210195591777',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ABS',
        fechaNotificacion: new Date('2022-07-22 14:10')
      },
      {
        nMensaje: '202210195591776',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ABS',
        fechaNotificacion: new Date('2022-07-22 14:09')
      },
      {
        nMensaje: '202210195591775',
        tipoMensaje: 'Notificación',
        remitente: 'Jdo. de lo Penal Nº 1 de Burgos',
        asunto: 'ASUNTO EN DATOS ENVIO 999999',
        nAnio: '999999/2023',
        tipoProc: 'ABS',
        fechaNotificacion: new Date('2022-07-22 14:08')
      }
    ];
}

}
