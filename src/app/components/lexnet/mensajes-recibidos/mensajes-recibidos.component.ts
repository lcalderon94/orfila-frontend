// mensajes-recibidos.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MENSAJES_RECIBIDOS_MOCK } from '../../../mock-data/lexnet.mock';


export interface MensajeRecibido {
  nMensaje: string;
  tipoMensaje: string;
  remitente: string;
  asunto: string;
  nAnio: string;
  tipoProc: string;
  fechaNotificacion: Date;
}

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
    this.dataSource = new MatTableDataSource<MensajeRecibido>(MENSAJES_RECIBIDOS_MOCK);
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

}
