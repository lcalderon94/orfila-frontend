import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { LOCALIZACIONES_MOCK } from '../../../mock-data/muestras.mock';

export interface Localizacion {
  tipoLocalizacion: string;
  sedeCP: string;
  plantaEdificio: string;
  descripcionLocalizacion: string;
  codigoBarras: string;
}

@Component({
  selector: 'app-localizaciones',
  templateUrl: './localizaciones.component.html',
  styleUrls: ['./localizaciones.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LocalizacionesComponent implements OnInit, AfterViewInit {
  columnasVisibles: string[] = [
    'select',
    'tipoLocalizacion',
    'sedeCP',
    'plantaEdificio',
    'descripcionLocalizacion',
    'codigoBarras',
    'opciones'
  ];

  dataSource: MatTableDataSource<Localizacion>;
  selection = new SelectionModel<Localizacion>(true, []);
  itemsPorPagina = 10;
  mostrarFiltros = false;

  filtros = {
    tipoLocalizacion: 'local',
    sedeCP: '',
    plantaEdificio: '',
    descripcionLocalizacion: '',
    codigoBarras: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table', { static: true }) table!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Localizacion>(LOCALIZACIONES_MOCK);
  }

  

  ngOnInit() {
    this.configurarFiltrado();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Localizacion, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      return Object.keys(searchTerms).every(key => {
        const value = searchTerms[key].toString().toLowerCase();
        return !value || data[key as keyof Localizacion]
                        .toString()
                        .toLowerCase()
                        .includes(value);
      });
    };
  }

  aplicarFiltros() {
    const filtrosString = JSON.stringify(this.filtros);
    this.dataSource.filter = filtrosString;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.snackBar.open('Filtros aplicados', 'Cerrar', {
      duration: 3000
    });
  }

  limpiarFiltros() {
    this.filtros = {
      tipoLocalizacion: 'local',
      sedeCP: '',
      plantaEdificio: '',
      descripcionLocalizacion: '',
      codigoBarras: ''
    };
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.snackBar.open('Filtros limpiados', 'Cerrar', {
      duration: 3000
    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row: Localizacion) => this.selection.select(row));
    }
  }

  verLocalizacion(localizacion: Localizacion) {
    console.log('Ver localización:', localizacion);
    // Implementar lógica para ver/editar localización
  }

  eliminarLocalizacion(localizacion: Localizacion) {
    console.log('Eliminar localización:', localizacion);
    this.snackBar.open('Localización eliminada', 'Cerrar', {
      duration: 3000
    });
  }

  imprimirCodigo(localizacion: Localizacion) {
    console.log('Imprimir código:', localizacion);
    this.snackBar.open('Generando código de barras...', 'Cerrar', {
      duration: 3000
    });
  }

  insertarMuestra(localizacion: Localizacion) {
    console.log('Insertar muestra:', localizacion);
    this.snackBar.open('Añadiendo muestra...', 'Cerrar', {
      duration: 3000
    });
  }

  verMuestras(localizacion: Localizacion) {
    console.log('Ver muestras:', localizacion);
    // Implementar lógica para ver muestras
  }

  cargarDatos() {
    this.dataSource.data = LOCALIZACIONES_MOCK;
    this.snackBar.open('Datos actualizados', 'Cerrar', {
      duration: 3000
    });
  }
}