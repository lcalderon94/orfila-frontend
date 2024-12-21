import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MOCK_TAREAS } from '../../mock-data/tareas.mock';


export interface Tarea {
  organo: string;
  numEpisodio: string;
  tipoProcedimiento: string;
  numAnio: string;
  tipoAsistencia: string;
  numExpediente: string;
  sujeto: string;
  responsable: string[];  // Ahora es un array de strings
  prioridad?: boolean;
  nuevoDocumento?: boolean;
  grupal?: boolean;
}

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<Tarea>;
  mostrarFiltros = false;
  itemsPorPagina = 10;

  columnasVisibles: string[] = [
    'iconos',
    'organo',
    'numEpisodio',
    'tipoProcedimiento',
    'numAnio',
    'tipoAsistencia',
    'numExpediente',
    'sujeto',
    'responsable'
  ];

  filtros = {
    incluirFinalizadas: false,
    soloMiIml: true
  };

  filtrosColumnas = {
    organo: '',
    numEpisodio: '',
    tipoProcedimiento: '',
    numAnio: '',
    tipoAsistencia: '',
    numExpediente: '',
    sujeto: '',
    responsable: ''
  };

  constructor(
    private snackBar: MatSnackBar,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.dataSource = new MatTableDataSource(this.obtenerDatosEjemplo());
  }

  ngOnInit() {
    this.configurarFiltrado();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.configurarPaginadorEspanol();
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  obtenerTituloColumna(columna: string): string {
    const titulos: { [key: string]: string } = {
      'iconos': '',
      'organo': 'ÓRGANO',
      'numEpisodio': 'Nº EPISODIO',
      'tipoProcedimiento': 'TIPO PROCEDIMIENTO',
      'numAnio': 'Nº/AÑO',
      'tipoAsistencia': 'TIPO ASISTENCIA',
      'numExpediente': 'Nº EXPEDIENTE',
      'sujeto': 'SUJETO',
      'responsable': 'RESPONSABLE'
    };
    return titulos[columna] || columna;
  }

  verDetalle(tarea: Tarea): void {
    this.mostrarMensaje(`Viendo detalle de tarea ${tarea.numEpisodio}`);
    console.log('Detalle de tarea:', tarea);
  }

  hasSujetosMultiples(responsable: string[]): boolean {
    return responsable && responsable.length > 1;
  }

  private obtenerDatosEjemplo() {
    return MOCK_TAREAS;
  }

  private configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Tarea, filter: string) => {
      const searchTerms = JSON.parse(filter);
      let cumpleFiltros = true;
      
      if (!searchTerms.incluirFinalizadas && this.filtros.incluirFinalizadas === false) {
        return false;
      }
      
      if (searchTerms.soloMiIml && this.filtros.soloMiIml === true) {
        return false;
      }

      Object.keys(searchTerms.columnas).forEach(key => {
        const valor = searchTerms.columnas[key].toLowerCase();
        if (valor && data[key as keyof Tarea]) {
          const dataValue = String(data[key as keyof Tarea]).toLowerCase();
          if (!dataValue.includes(valor)) {
            cumpleFiltros = false;
          }
        }
      });

      return cumpleFiltros;
    };
  }

  filtrarTabla() {
    const filtroCompleto = {
      incluirFinalizadas: this.filtros.incluirFinalizadas,
      soloMiIml: this.filtros.soloMiIml,
      columnas: this.filtrosColumnas
    };
    this.dataSource.filter = JSON.stringify(filtroCompleto);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFiltros() {
    this.filtros = {
      incluirFinalizadas: false,
      soloMiIml: true
    };

    this.filtrosColumnas = {
      organo: '',
      numEpisodio: '',
      tipoProcedimiento: '',
      numAnio: '',
      tipoAsistencia: '',
      numExpediente: '',
      sujeto: '',
      responsable: ''
    };

    this.filtrarTabla();
    this.mostrarMensaje('Filtros limpiados');
  }

  aplicarFiltros() {
    this.filtrarTabla();
    this.mostrarMensaje('Filtros aplicados');
  }

  cambiarItemsPorPagina(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.itemsPorPagina = Number(selectElement.value);
    if (this.paginator) {
      this.paginator.pageSize = this.itemsPorPagina;
      this.paginator.pageIndex = 0;
    }
  }

  cargarTareas() {
    this.dataSource.data = this.obtenerDatosEjemplo();
    this.mostrarMensaje('Datos actualizados');
  }

  exportarWord() {
    this.mostrarMensaje('Exportando a Word...');
  }

  exportarPDF() {
    this.mostrarMensaje('Exportando a PDF...');
  }

  exportarExcel() {
    this.mostrarMensaje('Exportando a Excel...');
  }

  private configurarPaginadorEspanol() {
    this.paginatorIntl.itemsPerPageLabel = 'Items por página:';
    this.paginatorIntl.nextPageLabel = 'Siguiente';
    this.paginatorIntl.previousPageLabel = 'Anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? 
        Math.min(startIndex + pageSize, length) : 
        startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // En el ts modificamos la condición de mostrar el icono
  verifyUnassigned(responsable: string[]): boolean {
    return !responsable || responsable.length === 0;
  }

// Y en la columna responsable, antes de mostrar el valor hacemos la transformación
transformResponsable(responsable: string[]): string {
  return !responsable || responsable.length === 0 ? 'Sin asignar' : responsable.join(', ');
}
}