import { Component, OnInit, ViewChild, ElementRef, Renderer2, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { EpisodiosService, Episodio } from 'src/app/services/episodio.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listado-episodios',
  templateUrl: './listado-episodios.component.html',
  styleUrls: ['./listado-episodios.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ListadoEpisodiosComponent implements OnInit, AfterViewInit {
  columnasVisibles: string[] = [
    'nEpisodio',
    'fechaHecho',
    'organoAseguradora',
    'tipoProcedimiento',
    'nAnio',
    'admResponsable',
    'nExpediente',
    'sujeto',
    'opciones'
  ];
  dataSource: MatTableDataSource<Episodio>;
  itemsPorPagina = 10;
  mostrarFiltros = false;
  
  filtros = {
    tipoSolicitante: 'todos',
    tipoAsistencia: '',
    fechaRegistroDesde: null,
    fechaRegistroHasta: null,
    fechaActualizacionDesde: null,
    fechaActualizacionHasta: null,
    nig: '',
    incluirFinalizadas: false,
    nombreSujeto: '',
    numExpediente: '',
    apellido1Sujeto: '',
    apellido2Sujeto: '',
    numIdentificacion: ''
  };

  anchosCabeceros: { [key: string]: string } = {
    'nEpisodio': '120px',
    'fechaHecho': '150px',
    'organoAseguradora': '250px',
    'tipoProcedimiento': '250px',
    'nAnio': '120px',
    'admResponsable': '180px',
    'nExpediente': '150px',
    'sujeto': '200px',
    'opciones': '120px'
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('table', { static: true }) table!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private episodiosService: EpisodiosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Episodio>();
  }

  ngOnInit(): void {
    this.cargarEpisodios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.aplicarAnchosCabeceros();
  }

  cargarEpisodios(): void {
    this.episodiosService.getEpisodios().subscribe(
      episodios => {
        this.dataSource.data = episodios;
      },
      error => {
        console.error('Error al cargar episodios', error);
        this.snackBar.open('Error al cargar episodios', 'Cerrar', { duration: 3000 });
      }
    );
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros() {
    // Implementa la lógica de filtrado aquí
    console.log('Filtros aplicados:', this.filtros);
    // Aquí deberías llamar a un método del servicio que aplique los filtros
    // y actualice this.dataSource.data con los resultados
  }

  limpiarFiltros() {
    this.filtros = {
      tipoSolicitante: 'todos',
      tipoAsistencia: '',
      fechaRegistroDesde: null,
      fechaRegistroHasta: null,
      fechaActualizacionDesde: null,
      fechaActualizacionHasta: null,
      nig: '',
      incluirFinalizadas: false,
      nombreSujeto: '',
      numExpediente: '',
      apellido1Sujeto: '',
      apellido2Sujeto: '',
      numIdentificacion: ''
    };
    this.cargarEpisodios(); // Recargar todos los episodios sin filtros
  }

  obtenerTituloColumna(columna: string): string {
    const titulos: { [key: string]: string } = {
      'nEpisodio': 'Nº EPISODIO',
      'fechaHecho': 'FECHA HECHO',
      'organoAseguradora': 'ÓRGANO / ASEGURADORA',
      'tipoProcedimiento': 'TIPO PROCEDIMIENTO',
      'nAnio': 'Nº/AÑO',
      'admResponsable': 'ADM. RESPONSABLE',
      'nExpediente': 'Nº EXPEDIENTE',
      'sujeto': 'SUJETO',
      'opciones': 'OPCIONES'
    };
    return titulos[columna] || columna;
  }

  aplicarAnchosCabeceros() {
    const cabeceros = this.table.nativeElement.querySelectorAll('th');
    cabeceros.forEach((cabecero: HTMLElement, index: number) => {
      const columna = this.columnasVisibles[index];
      if (this.anchosCabeceros[columna]) {
        this.renderer.setStyle(cabecero, 'width', this.anchosCabeceros[columna]);
      }
    });
  }

  alRedimensionarColumna(evento: MouseEvent, columna: string) {
    evento.preventDefault();
    const th = evento.target as HTMLElement;
    const startX = evento.pageX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (e: MouseEvent) => {
      const width = startWidth + (e.pageX - startX);
      this.renderer.setStyle(th, 'width', `${width}px`);
      this.anchosCabeceros[columna] = `${width}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  cambiarItemsPorPagina() {
    this.paginator.pageSize = this.itemsPorPagina;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }

  eliminarEpisodio(nEpisodio: string) {
    const confirmacion = window.confirm('¿Está seguro de que desea eliminar este episodio?');
    
    if (confirmacion) {
      this.episodiosService.eliminarEpisodio(nEpisodio).subscribe(
        () => {
          this.snackBar.open('Episodio eliminado con éxito', 'Cerrar', { 
            duration: 3000 
          });
          this.cargarEpisodios();
        },
        error => {
          console.error('Error al eliminar episodio', error);
          this.snackBar.open('Error al eliminar episodio', 'Cerrar', { 
            duration: 3000 
          });
        }
      );
    }
  }

  verSujetos(nEpisodio: string) {
    console.log('Ver sujetos del episodio:', nEpisodio);
    this.router.navigate(['/administracion-sujetos'], { 
      queryParams: { episodio: nEpisodio }
    });
  }
}