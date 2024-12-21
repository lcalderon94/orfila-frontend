import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ESTADOS_ENVIO_MOCK } from '../../../mock-data/lexnet.mock';


export interface EstadoEnvio {
  fEnvio: string;
  nEnvio: string;
  episodio: string;
  tipoProcedimiento: string;
  nAnio: string;
  tipoDocPrincipal: string;
  usuario: string;
  estado: string;
}

@Component({
  selector: 'app-estado-envios',
  templateUrl: './estado-envios.component.html',
  styleUrls: ['./estado-envios.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EstadoEnviosComponent implements OnInit {
  
  columnasVisibles: string[] = [
    'fEnvio',
    'nEnvio',
    'episodio',
    'tipoProcedimiento',
    'nAnio',
    'tipoDocPrincipal',
    'usuario',
    'estado',
    'opciones'
  ];

  dataSource: MatTableDataSource<EstadoEnvio>;
  itemsPorPagina = 10;
  
  filtrosForm: FormGroup = this.fb.group({
    fechaDesde: [''],
    fechaHasta: [''],
    episodio: [''],
    tipoProcedimiento: [''],
    nAnio: [''],
    tipoDocPrincipal: [''],
    usuario: [''],
    estado: ['']
  });

  filtrosColumnas = {
    fEnvio: '',
    nEnvio: '',
    episodio: '',
    tipoProcedimiento: '',
    nAnio: '',
    tipoDocPrincipal: '',
    usuario: '',
    estado: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<EstadoEnvio>(ESTADOS_ENVIO_MOCK);
  }

  ngOnInit() {
    this.configurarFiltrado();
    this.cargarDatos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private configurarFiltrado() {
    this.dataSource.filterPredicate = (data: EstadoEnvio, filter: string) => {
      const searchTerms = JSON.parse(filter);
      
      let cumpleFiltros = true;
      Object.keys(this.filtrosColumnas).forEach(key => {
        const valor = searchTerms[key].toLowerCase();
        if (valor && data[key as keyof EstadoEnvio]) {
          const dataValue = String(data[key as keyof EstadoEnvio]).toLowerCase();
          if (!dataValue.includes(valor)) {
            cumpleFiltros = false;
          }
        }
      });

      return cumpleFiltros;
    };
  }

  cargarDatos() {
    this.dataSource.data = ESTADOS_ENVIO_MOCK;
  }

  aplicarFiltrosColumnas() {
    const filtroJson = JSON.stringify(this.filtrosColumnas);
    this.dataSource.filter = filtroJson;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  limpiarFiltros() {
    this.filtrosForm.reset();
    this.filtrosColumnas = {
      fEnvio: '',
      nEnvio: '',
      episodio: '',
      tipoProcedimiento: '',
      nAnio: '',
      tipoDocPrincipal: '',
      usuario: '',
      estado: ''
    };
    this.aplicarFiltrosColumnas();
    this.mostrarMensaje('Filtros limpiados');
  }

  buscar() {
    console.log('Filtros aplicados:', this.filtrosForm.value);
    this.mostrarMensaje('Búsqueda realizada');
  }

  actualizarEstadoMensajes() {
    this.mostrarMensaje('Actualizando estados de mensajes...');
  }

  verDetalle(envio: EstadoEnvio) {
    console.log('Ver detalle:', envio);
  }

  verAcuse(envio: EstadoEnvio) {
    console.log('Ver acuse:', envio);
  }

  cambiarItemsPorPagina() {
    if (this.paginator) {
      this.paginator.pageSize = this.itemsPorPagina;
      this.paginator.pageIndex = 0;
    }
  }

  private mostrarMensaje(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  obtenerTituloColumna(columna: string): string {
    const titulos: { [key: string]: string } = {
      'fEnvio': 'F. ENVÍO',
      'nEnvio': 'N. ENVÍO',
      'episodio': 'EPISODIO',
      'tipoProcedimiento': 'TIPO PROCEDIMIENTO',
      'nAnio': 'Nº/AÑO',
      'tipoDocPrincipal': 'TIPO DOC. PRINCIPAL',
      'usuario': 'USUARIO',
      'estado': 'ESTADO',
      'opciones': 'OPCIONES'
    };
    return titulos[columna] || columna;
  }
}