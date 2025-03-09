import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MuestrasService, Carga } from 'src/app/services/muestras.service';

@Component({
  selector: 'app-cargas-sistema',
  templateUrl: './cargas-sistema.component.html',
  styleUrls: ['./cargas-sistema.component.css']
})
export class CargasSistemaComponent implements OnInit, AfterViewInit {
  columnasVisibles: string[] = [
    'idCarga',
    'fechaCarga',
    'numeroDeMuestras',
    'usuarioCarga',
    'opciones'
  ];
  
  dataSource: MatTableDataSource<Carga>;
  mostrarFiltros = false;
  registrosPorPagina = 10;
  
  filtros = {
    estadoCarga: 'todas', // 'no_procesadas', 'procesadas', 'todas'
    fechaDesde: null,
    fechaHasta: null
  };
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  constructor(
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource<Carga>([]);
  }
  
  ngOnInit(): void {
    this.cargarCargas();
  }
  
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }
  
  cargarCargas(): void {
    const filtros = {
      procesada: this.filtros.estadoCarga === 'procesadas' ? true : 
                (this.filtros.estadoCarga === 'no_procesadas' ? false : undefined),
      fechaDesde: this.filtros.fechaDesde,
      fechaHasta: this.filtros.fechaHasta
    };
    
    this.muestrasService.getCargas(filtros).subscribe(
      cargas => {
        this.dataSource.data = cargas;
      },
      error => {
        this.snackBar.open('Error al cargar las cargas del sistema', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }
  
  aplicarFiltros(): void {
    this.cargarCargas();
  }
  
  limpiarFiltros(): void {
    this.filtros = {
      estadoCarga: 'todas',
      fechaDesde: null,
      fechaHasta: null
    };
    
    this.cargarCargas();
  }
  
  procesarCarga(carga: Carga): void {
    if (carga.procesada) {
      return;
    }
    
    this.muestrasService.procesarCarga(carga.id).subscribe(
      cargaProcesada => {
        // Determinar si hay errores
        const hayErrores = cargaProcesada.registros.some(reg => reg.estado === 'error');
        
        if (hayErrores) {
          this.router.navigate(['/gestion-muestras/carga-codigos'], { 
            state: { cargaId: carga.id } 
          });
        } else {
          this.snackBar.open(`La carga con nº ${carga.id} se ha procesado correctamente`, 'Cerrar', {
            duration: 3000
          });
          this.cargarCargas();
        }
      },
      error => {
        this.snackBar.open('Error al procesar la carga', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }
  
  eliminarCarga(carga: Carga): void {
    if (carga.procesada) {
      return;
    }
    
    if (confirm('¿Está seguro de eliminar esta carga?')) {
      this.muestrasService.eliminarCarga(carga.id).subscribe(
        success => {
          if (success) {
            this.snackBar.open('Carga eliminada correctamente', 'Cerrar', {
              duration: 3000
            });
            this.cargarCargas();
          } else {
            this.snackBar.open('Error al eliminar la carga', 'Cerrar', {
              duration: 3000
            });
          }
        },
        error => {
          this.snackBar.open('Error al eliminar la carga', 'Cerrar', {
            duration: 3000
          });
        }
      );
    }
  }
  
  cambiarRegistrosPorPagina(): void {
    if (this.paginator) {
      this.paginator.pageSize = this.registrosPorPagina;
      this.paginator.firstPage();
    }
  }
  
  volver(): void {
    this.router.navigate(['/gestion-muestras']);
  }
}