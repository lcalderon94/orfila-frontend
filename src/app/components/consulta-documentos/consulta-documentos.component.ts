import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MOCK_DOCUMENTOS } from '../../mock-data/documentos.mock';


interface Documento {
  fechaCreacion: Date;
  tipo: string;
  nombre: string;
  descLexnet: string;
  numAnio: string;
  numEpisodio: string;
  autorInforme: string;
  estado: string;
}

@Component({
  selector: 'app-consulta-documentos',
  templateUrl: './consulta-documentos.component.html',
  styleUrls: ['./consulta-documentos.component.css']
})
export class ConsultaDocumentosComponent implements OnInit {
  mostrarFiltros = false;
  itemsPorPagina = 10;
  dataSource: MatTableDataSource<Documento>;
  filtrosForm!: FormGroup;

  columnasVisibles = [
    'fechaCreacion',
    'tipo',
    'nombre',
    'descLexnet',
    'numAnio',
    'numEpisodio',
    'autorInforme',
    'estado',
    'opciones'
  ];

  filtrosColumnas = {
    fechaCreacion: '',
    tipo: '',
    nombre: '',
    descLexnet: '',
    numAnio: '',
    numEpisodio: '',
    autorInforme: '',
    estado: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Documento>(MOCK_DOCUMENTOS);
    this.inicializarFormulario();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.configurarFiltrado();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  inicializarFormulario() {
    this.filtrosForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      estado: [''],
      tipoPerito: [''],
      autorInforme: [''],
      fechaResponsable: [''],
      textoBuscar: [''],
      numAnio: ['']
    });
  }

  configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Documento, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      // Filtros de columnas
      let cumpleFiltros = true;
      Object.keys(this.filtrosColumnas).forEach(key => {
        const valor = searchTerms[key].toLowerCase();
        if (valor && data[key as keyof Documento]) {
          const dataValue = String(data[key as keyof Documento]).toLowerCase();
          if (!dataValue.includes(valor)) {
            cumpleFiltros = false;
          }
        }
      });

      return cumpleFiltros;
    };
  }

  aplicarFiltrosColumnas() {
    const filtroJson = JSON.stringify(this.filtrosColumnas);
    this.dataSource.filter = filtroJson;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  cambiarItemsPorPagina() {
    if (this.paginator) {
      this.paginator.pageSize = this.itemsPorPagina;
      this.paginator.pageIndex = 0;
    }
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.filtrosColumnas = {
      fechaCreacion: '',
      tipo: '',
      nombre: '',
      descLexnet: '',
      numAnio: '',
      numEpisodio: '',
      autorInforme: '',
      estado: ''
    };
    this.aplicarFiltrosColumnas();
    this.snackBar.open('Filtros limpiados', 'Cerrar', {
      duration: 3000
    });
  }

  buscar() {
    console.log('Filtros aplicados:', this.filtrosForm.value);
    // Aquí iría la lógica de búsqueda con el servicio
    this.snackBar.open('Búsqueda realizada', 'Cerrar', {
      duration: 3000
    });
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
    // Aquí iría la llamada al servicio para recargar datos
    this.snackBar.open('Actualizando datos...', 'Cerrar', {
      duration: 3000
    });
  }

  verDetalle(row: Documento) {
    console.log('Ver detalle del documento:', row);
    // Implementar lógica para ver detalle
  }
}