// estado-envios.component.ts (actualizado)
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService, EstadoEnvio } from 'src/app/services/lexnet.service';

@Component({
  selector: 'app-estado-envios',
  templateUrl: './estado-envios.component.html',
  styleUrls: ['./estado-envios.component.css']
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
  itemsPorPagina = 20; // Según requisito RF-REG-138, mostrar 20 registros por defecto
  
  filtrosForm: FormGroup;

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
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService
  ) {
    this.dataSource = new MatTableDataSource<EstadoEnvio>([]);
    
    this.filtrosForm = this.fb.group({
      fechaDesde: [''],
      fechaHasta: ['']
    });
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
    this.lexnetService.getEstadosEnvios(this.filtrosForm.value).subscribe({
      next: (estadosEnvio) => {
        this.dataSource.data = estadosEnvio;
      },
      error: (error) => {
        console.error('Error al cargar estados de envío:', error);
        this.snackBar.open('Error al cargar los estados de envío', 'Cerrar', { duration: 3000 });
      }
    });
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
    this.snackBar.open('Filtros limpiados', 'Cerrar', { duration: 3000 });
  }

  buscar() {
    console.log('Filtros aplicados:', this.filtrosForm.value);
    this.cargarDatos();
  }

  actualizarEstadoMensajes() {
    this.lexnetService.actualizarEstadoMensajes().subscribe({
      next: (resultado) => {
        this.cargarDatos();
      }
    });
  }

  verDetalle(envio: EstadoEnvio) {
    this.router.navigate(['/lexnet/detalle-envio', envio.id]);
  }

  verAcuse(envio: EstadoEnvio) {
    this.router.navigate(['/lexnet/acuse-recibo', envio.id]);
  }

  cambiarItemsPorPagina() {
    if (this.paginator) {
      this.paginator.pageSize = this.itemsPorPagina;
      this.paginator.pageIndex = 0;
    }
  }

  exportarWord() {
    this.snackBar.open('Exportando a Word...', 'Cerrar', { duration: 3000 });
  }

  exportarPDF() {
    this.snackBar.open('Exportando a PDF...', 'Cerrar', { duration: 3000 });
  }

  exportarExcel() {
    this.snackBar.open('Exportando a Excel...', 'Cerrar', { duration: 3000 });
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