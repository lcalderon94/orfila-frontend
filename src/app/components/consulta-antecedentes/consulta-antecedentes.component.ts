import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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

  filtros = {
    numExpediente: '',
    tipoIdentificacion: '',
    numIdentificacion: '',
    nombre: '',
    apellido1: '',
    apellido2: '',
    fechaNacimiento: null
  };

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

  constructor(private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar el filtrado personalizado
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      return Object.keys(searchTerms).every(key => {
        const value = searchTerms[key].toLowerCase();
        return String(data[key]).toLowerCase().includes(value);
      });
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  limpiarFiltros() {
    this.filtros = {
      numExpediente: '',
      tipoIdentificacion: '',
      numIdentificacion: '',
      nombre: '',
      apellido1: '',
      apellido2: '',
      fechaNacimiento: null
    };
    this.aplicarFiltros();
  }

  buscar() {
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    this.dataSource.filter = JSON.stringify(this.filtros);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  verDetalle(elemento: any) {
    console.log('Ver detalle:', elemento);
  }

  crearEpisodio(elemento: any) {
    console.log('Crear episodio:', elemento);
  }

  anadirSujeto(elemento: any) {
    console.log('Añadir sujeto:', elemento);
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
    // Aquí iría la carga desde el servicio
    this.snackBar.open('Actualizando datos...', 'Cerrar', {
      duration: 3000
    });
  }
}