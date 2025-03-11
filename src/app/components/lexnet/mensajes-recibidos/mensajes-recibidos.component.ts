// mensajes-recibidos.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService, MensajeRecibido } from 'src/app/services/lexnet.service';

@Component({
  selector: 'app-mensajes-recibidos',
  templateUrl: './mensajes-recibidos.component.html',
  styleUrls: ['./mensajes-recibidos.component.css']
})
export class MensajesRecibidosComponent implements OnInit {
  mostrarFiltros = false;
  dataSource: MatTableDataSource<MensajeRecibido>;
  itemsPorPagina = 20; // Según requisito RF-REG-138, mostrar 20 registros por defecto
  
  filtros = {
    estado: 'todos',
    fechaConsultaDesde: null,
    fechaConsultaHasta: new Date()
  };

  columnasVisibles = [
    'leido',
    'nMensaje',
    'tipoMensaje',
    'remitente',
    'asunto',
    'nAnio',
    'tipoProc',
    'fechaNotificacion',
    'opciones'
  ];

  columnasSinOpciones: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService
  ) {
    this.dataSource = new MatTableDataSource<MensajeRecibido>([]);
    this.columnasSinOpciones = this.columnasVisibles.filter(col => col !== 'opciones' && col !== 'leido');
  }

  ngOnInit() {
    this.cargarMensajes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarMensajes() {
    this.lexnetService.getMensajesRecibidos(this.filtros).subscribe({
      next: (mensajes) => {
        this.dataSource.data = mensajes;
      },
      error: (error) => {
        console.error('Error al cargar mensajes:', error);
        this.snackBar.open('Error al cargar los mensajes', 'Cerrar', { duration: 3000 });
      }
    });
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limpiarFiltros() {
    this.filtros = {
      estado: 'todos',
      fechaConsultaDesde: null,
      fechaConsultaHasta: new Date()
    };
  }

  buscar() {
    this.cargarMensajes();
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

  verDetalle(elemento: MensajeRecibido) {
    console.log('Navegando a detalle de mensaje:', elemento);
    
    // Marcar como leído si no lo estaba
    if (!elemento.leido) {
      this.lexnetService.marcarComoLeido(elemento.id).subscribe();
    }
    
    // Verificar que el elemento tiene un tipo de mensaje válido
    const tipoMensaje = elemento.tipoMensaje?.trim();
    console.log('Tipo de mensaje:', tipoMensaje);
    
    try {
      if (tipoMensaje === 'Notificación') {
        console.log(`Intentando navegar a: /lexnet/detalle-notificacion/${elemento.id}`);
        this.router.navigateByUrl(`/lexnet/detalle-notificacion/${elemento.id}`);
      } else if (tipoMensaje === 'Escrito') {
        console.log(`Intentando navegar a: /lexnet/detalle-escrito/${elemento.id}`);
        this.router.navigateByUrl(`/lexnet/detalle-escrito/${elemento.id}`);
      } else {
        console.warn('Tipo de mensaje no reconocido:', tipoMensaje);
        this.snackBar.open(`Tipo de mensaje no reconocido: ${tipoMensaje}`, 'Cerrar', { duration: 3000 });
      }
    } catch (error) {
      console.error('Error durante la navegación:', error);
      this.snackBar.open('Error al navegar al detalle del mensaje', 'Cerrar', { duration: 3000 });
    }
  }

  toggleLeido(evento: Event, elemento: MensajeRecibido) {
    evento.stopPropagation(); // Prevenir que se active el evento de la fila
    
    if (elemento.leido) {
      this.lexnetService.marcarComoNoLeido(elemento.id).subscribe({
        next: () => {
          elemento.leido = false;
          this.snackBar.open('Mensaje marcado como no leído', 'Cerrar', { duration: 2000 });
        }
      });
    } else {
      this.lexnetService.marcarComoLeido(elemento.id).subscribe({
        next: () => {
          elemento.leido = true;
          this.snackBar.open('Mensaje marcado como leído', 'Cerrar', { duration: 2000 });
        }
      });
    }
  }
}