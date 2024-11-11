import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';

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
    this.dataSource = new MatTableDataSource<Localizacion>(this.getDatosIniciales());
  }

  private getDatosIniciales(): Localizacion[] {
    return [
      {
        tipoLocalizacion: 'LI',
        sedeCP: '22222',
        plantaEdificio: '111',
        descripcionLocalizacion: 'nueva localización',
        codigoBarras: 'LI22222111000188'
      },
      {
        tipoLocalizacion: 'LE',
        sedeCP: '28034',
        plantaEdificio: '',
        descripcionLocalizacion: 'estanteria vacía',
        codigoBarras: 'LE28034000289'
      },
      {
        tipoLocalizacion: 'LI',
        sedeCP: '11111',
        plantaEdificio: '111',
        descripcionLocalizacion: 'varios',
        codigoBarras: 'LI11111111000000'
      },
      {
        tipoLocalizacion: 'LI',
        sedeCP: '33333',
        plantaEdificio: '333',
        descripcionLocalizacion: 'sergio2',
        codigoBarras: 'LI33333333000000'
      },
      {
        tipoLocalizacion: 'LE',
        sedeCP: '11111',
        plantaEdificio: '',
        descripcionLocalizacion: 'sergio primera balida',
        codigoBarras: 'LE11111000000'
      },
      {
        tipoLocalizacion: 'LI',
        sedeCP: '000001',
        plantaEdificio: '001',
        descripcionLocalizacion: 'Bernabé M y L',
        codigoBarras: 'LI000001001000004'
      },
      {
        tipoLocalizacion: 'LI',
        sedeCP: '22222',
        plantaEdificio: '333',
        descripcionLocalizacion: 'sergio2',
        codigoBarras: 'LI22222333000062'
      },
      {
        tipoLocalizacion: 'LI',
        sedeCP: '11111',
        plantaEdificio: '111',
        descripcionLocalizacion: 'sergio',
        codigoBarras: 'LI11111111000061'
      },
      {
        tipoLocalizacion: 'LE',
        sedeCP: '130006',
        plantaEdificio: '',
        descripcionLocalizacion: 'Sótano del IML de Ciudad Real',
        codigoBarras: 'LE130006375'
      }
    ];
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
    this.dataSource.data = this.getDatosIniciales();
    this.snackBar.open('Datos actualizados', 'Cerrar', {
      duration: 3000
    });
  }
}