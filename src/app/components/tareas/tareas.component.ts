import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Tarea {
  organo: string;
  numEpisodio: string;
  tipoProcedimiento: string;
  numAnio: string;
  tipoAsistencia: string;
  numExpediente: string;
  sujeto: string;
  responsable: string;
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

  private obtenerDatosEjemplo(): Tarea[] {
    return [
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81329',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000025/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2017586',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: '30000332C',
        prioridad: true
      },
      {
        organo: 'Sección 2ª de la A. Prov. Valladolid',
        numEpisodio: '81136',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000002/2022',
        tipoAsistencia: 'Análisis Genético',
        numExpediente: 'EX2013527',
        sujeto: '-',
        responsable: 'Asignar',
        grupal: true
      },
      {
        organo: 'Abog. CCAA de CASTILLA Y LEON',
        numEpisodio: '81336',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Informe social genérico',
        numExpediente: 'EX2013607',
        sujeto: 'Antonio Orozco',
        responsable: '30000332C'
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81320',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000001/2022',
        tipoAsistencia: 'Autopsia',
        numExpediente: 'EX2013586',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: 'Asignar',
        nuevoDocumento: true
      },
      {
        organo: 'Jdo. de lo Penal Nº 1 de Salamanca',
        numEpisodio: '81305',
        tipoProcedimiento: 'ASISTENCIAS SECRETARIOS JUDICIALES',
        numAnio: '000002/2022',
        tipoAsistencia: 'Valoración psicológica general',
        numExpediente: 'EX2013585',
        sujeto: 'Maria Isabel Rodriguez Alvarez',
        responsable: '30000328W'
      }
    ];
  }

  private configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Tarea, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      // Aplicar filtros generales
      let cumpleFiltros = true;
      
      if (!searchTerms.incluirFinalizadas && this.filtros.incluirFinalizadas === false) {
        // Lógica para filtrar finalizadas según necesidad
        return false;
      }
      
      if (searchTerms.soloMiIml && this.filtros.soloMiIml === true) {
        // Lógica para filtrar por IML según necesidad
        return false;
      }

      // Aplicar filtros de columnas
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
    // Implementar exportación
  }

  exportarPDF() {
    this.mostrarMensaje('Exportando a PDF...');
    // Implementar exportación
  }

  exportarExcel() {
    this.mostrarMensaje('Exportando a Excel...');
    // Implementar exportación
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
}