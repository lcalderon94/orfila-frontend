// muestras-list.component.ts
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MuestrasService, Muestra } from 'src/app/services/muestras.service';

@Component({
  selector: 'app-muestras-list',
  templateUrl: './muestras-list.component.html',
  styleUrls: ['./muestras-list.component.css']
})
export class MuestrasListComponent implements OnInit, AfterViewInit {
  tituloComponente: string = 'Listado de Muestras';

  columnasVisibles: string[] = [
    'codigoBarrasMuestra',
    'fechaRegistro',
    'usuario',
    'descripcionLocalizacion',
    'codigoBarrasLocalizacion',
    'opciones'
  ];
  
  dataSource: MatTableDataSource<Muestra>;
  mostrarFiltros = false;
  
  filtros = {
    tipoRegistro: 'ultimo', // 'primero', 'historico', 'ultimo'
    fechaDesde: null,
    fechaHasta: null,
    tipoLocalizacion: 'todas', // 'local', 'externa', 'todas'
    codigoBarrasLocalizacion: '',
    descripcionMuestra: '',
    codigoBarrasMuestra: '',
    episodio: '',
    sujeto: '',
    usuarioRegistro: ''
  };
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource<Muestra>([]);
  }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['codigoBarrasLocalizacion']) {
        this.filtros.codigoBarrasLocalizacion = params['codigoBarrasLocalizacion'];
        
        // Actualizar el título si tenemos la descripción
        if (params['descripcionLocalizacion']) {
          this.tituloComponente = `Listado de Muestras de la localización ${params['descripcionLocalizacion']}`;
        }
        
        if (params['tipoRegistro']) {
          this.filtros.tipoRegistro = params['tipoRegistro'];
        }
        
        this.aplicarFiltros();
      }
    });
    
    this.configurarFiltrado();
    this.cargarMuestras();
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
  
  cargarMuestras() {
    this.muestrasService.getMuestras(this.filtros).subscribe(
      muestras => {
        this.dataSource.data = muestras;
      },
      error => {
        this.snackBar.open('Error al cargar las muestras', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }
  
  configurarFiltrado() {
    this.dataSource.filterPredicate = (data: Muestra, filter: string): boolean => {
      try {
        const searchTerms = JSON.parse(filter);
        
        // Si searchTerms está vacío, no aplicar filtro
        if (!searchTerms || Object.keys(searchTerms).length === 0) {
          return true;
        }
        
        // Verificar tipo de registro
        if (searchTerms.tipoRegistro && searchTerms.tipoRegistro !== 'todos') {
          // Lógica para filtrar por tipo de registro (primero, histórico, último)
          // Esta implementación dependerá de la estructura de datos
        }
        
        // Fechas
        const fechaRegistro = new Date(data.fechaRegistro);
        if (searchTerms.fechaDesde) {
          const fechaDesde = new Date(searchTerms.fechaDesde);
          if (fechaRegistro < fechaDesde) {
            return false;
          }
        }
        
        if (searchTerms.fechaHasta) {
          const fechaHasta = new Date(searchTerms.fechaHasta);
          if (fechaRegistro > fechaHasta) {
            return false;
          }
        }
        
        // Tipo de localización
        if (searchTerms.tipoLocalizacion && searchTerms.tipoLocalizacion !== 'todas') {
          if (data.localizacion.tipoLocalizacion !== searchTerms.tipoLocalizacion) {
            return false;
          }
        }
        
        // Resto de campos
        return [
          { field: 'localizacion.codigoBarras', value: searchTerms.codigoBarrasLocalizacion },
          { field: 'descripcion', value: searchTerms.descripcionMuestra },
          { field: 'codigoBarras', value: searchTerms.codigoBarrasMuestra },
          { field: 'episodioNumero', value: searchTerms.episodio },
          { field: 'sujetoNombre', value: searchTerms.sujeto },
          { field: 'usuario', value: searchTerms.usuarioRegistro }
        ].every(filter => {
          if (!filter.value) {
            return true;
          }
          
          // Obtener el valor del campo en el objeto data
          const getValue = (obj: any, path: string) => {
            return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
          };
          
          const dataValue = String(getValue(data, filter.field) || '').toLowerCase();
          const searchValue = filter.value.toLowerCase();
          
          return dataValue.includes(searchValue);
        });
      } catch (error) {
        console.error('Error al filtrar:', error);
        return true; // Si hay error en el filtro, mostrar todos los datos
      }
    };
  }
  
  aplicarFiltros() {
    this.cargarMuestras();
  }
  
  limpiarFiltros() {
    this.filtros = {
      tipoRegistro: 'ultimo',
      fechaDesde: null,
      fechaHasta: null,
      tipoLocalizacion: 'todas',
      codigoBarrasLocalizacion: '',
      descripcionMuestra: '',
      codigoBarrasMuestra: '',
      episodio: '',
      sujeto: '',
      usuarioRegistro: ''
    };
    
    this.dataSource.filter = '';
    this.cargarMuestras();
  }
  
  verDetalleMuestra(muestra: Muestra) {
    if (muestra.id) {
      this.router.navigate(['/gestion-muestras/muestra-detalle', muestra.id]);
    }
  }
  
  eliminarMuestra(muestra: Muestra) {
    if (!this.esUltimoMovimiento(muestra)) {
      return;
    }
    
    if (confirm('¿Está seguro que desea eliminar esta muestra?')) {
      if (muestra.id) {
        this.muestrasService.eliminarMuestra(muestra.id).subscribe(
          success => {
            if (success) {
              this.snackBar.open('Muestra eliminada correctamente', 'Cerrar', {
                duration: 3000
              });
              this.cargarMuestras();
            } else {
              this.snackBar.open('Error al eliminar la muestra', 'Cerrar', {
                duration: 3000
              });
            }
          },
          error => {
            this.snackBar.open('Error al eliminar la muestra', 'Cerrar', {
              duration: 3000
            });
          }
        );
      }
    }
  }
  
  descargarCodigoBarras(muestra: Muestra) {
    // En una implementación real, esto generaría y descargaría el código de barras
    this.snackBar.open('Descargando código de barras...', 'Cerrar', {
      duration: 3000
    });
  }
  
  imprimirEtiquetas() {
    this.snackBar.open('Imprimiendo etiquetas...', 'Cerrar', {
      duration: 3000
    });
  }
  
  imprimirListado() {
    this.snackBar.open('Imprimiendo listado...', 'Cerrar', {
      duration: 3000
    });
  }
  
  esUltimoMovimiento(muestra: Muestra): boolean {
    // Esta función verificaría si la muestra es el último movimiento
    // En una implementación real, esto dependería de la lógica de negocio
    return true;
  }
  
  volver() {
    this.router.navigate(['/gestion-muestras']);
  }
}