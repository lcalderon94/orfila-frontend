// src/app/components/sujetos/sujetos.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-sujetos',
  templateUrl: './sujetos.component.html',
  styleUrls: ['./sujetos.component.css']
})
export class SujetosComponent implements OnInit {
  mostrarFiltros = false;
  dataSource: MatTableDataSource<any>;

  filtros = {
    numExpediente: '',
    numIdentificacion: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    soloIndocumentados: false,
    soloMiIml: true
  };

  columnasVisibles = [
    'nombreIml',
    'numExpediente',
    'tipoIdentificacion',
    'numIdentificacion',
    'nombre',
    'apellido1',
    'apellido2',
    'fechaNacimiento',
    'opciones'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.cargarDatos();
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limpiarFiltros() {
    this.filtros = {
      numExpediente: '',
      numIdentificacion: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      soloIndocumentados: false,
      soloMiIml: true
    };
    this.cargarDatos();
  }

  buscar() {
    console.log('Filtros:', this.filtros);
  }

  cargarDatos() {
    // Implementar carga de datos
  }
}