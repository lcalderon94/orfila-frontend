import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consulta-antecedentes',
  templateUrl: './consulta-antecedentes.component.html',
  styleUrls: ['./consulta-antecedentes.component.css']
})
export class ConsultaAntecedentesComponent implements OnInit {
  mostrarFiltros = false;
  itemsPorPagina = 10;
  dataSource: MatTableDataSource<any>;
  filtrosForm: FormGroup = this.fb.group({  // Inicializado aquí
    numExpediente: [''],
    tipoIdentificacion: [''],
    numIdentificacion: [''],
    nombre: [''],
    apellido1: [''],
    apellido2: [''],
    fechaNacimiento: [null]
  });

  columnasVisibles = [
    'iml',
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

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  inicializarFormulario() {
    this.filtrosForm = this.fb.group({
      numExpediente: [''],
      tipoIdentificacion: [''],
      numIdentificacion: [''],
      nombre: [''],
      apellido1: [''],
      apellido2: [''],
      fechaNacimiento: [null]
    });
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cambiarItemsPorPagina() {
    if (this.paginator) {
      this.paginator.pageSize = this.itemsPorPagina;
      this.paginator.pageIndex = 0;
    }
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  buscar() {
    // Implementar lógica de búsqueda
    console.log(this.filtrosForm.value);
  }

  exportarWord() {
    this.snackBar.open('Exportando a Word...', 'Cerrar', {
      duration: 3000
    });
  }

  exportarPDF() {
    this.snackBar.open('Exportando a PDF...', 'Cerrar', {
      duration: 3000
    });
  }

  exportarExcel() {
    this.snackBar.open('Exportando a Excel...', 'Cerrar', {
      duration: 3000
    });
  }

  cargarDatos() {
    this.snackBar.open('Actualizando datos...', 'Cerrar', {
      duration: 3000
    });
  }

  verDetalle(row: any) {
    console.log('Ver detalle:', row);
  }

  crearEpisodio(row: any) {
    console.log('Crear episodio:', row);
  }

  anadirSujeto(row: any) {
    console.log('Añadir sujeto:', row);
  }
}