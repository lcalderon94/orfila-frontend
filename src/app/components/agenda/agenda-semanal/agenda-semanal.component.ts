import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgendaService, Evento } from '../../../services/agenda.service';
import { MatDialog } from '@angular/material/dialog';
import { EventoDialogComponent } from '../evento-dialog/evento-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

interface DiaSemana {
  fecha: Date;
  eventos: Evento[];
}

@Component({
  selector: 'app-agenda-semanal',
  templateUrl: './agenda-semanal.component.html',
  styleUrls: ['./agenda-semanal.component.css']
})
export class AgendaSemanalComponent implements OnInit, OnDestroy {
  semanaActual: Date = new Date();
  diasSemana: DiaSemana[] = [];
  nombresDias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  private eventosSubscription: Subscription | null = null;

  constructor(
    private agendaService: AgendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generarDiasSemana();
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }

  generarDiasSemana(): void {
    const fechaActual = new Date(this.semanaActual);
    
    // Encontrar el lunes de la semana actual
    const diaSemana = fechaActual.getDay() || 7; // 0 es domingo, lo convertimos a 7
    fechaActual.setDate(fechaActual.getDate() - (diaSemana - 1)); // Retroceder al lunes
    
    this.diasSemana = [];
    
    // Generar los 7 días de la semana
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() + i);
      
      this.diasSemana.push({
        fecha,
        eventos: []
      });
    }
  }

  cargarEventos(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
    
    this.eventosSubscription = this.agendaService.getEventosPorSemana(this.semanaActual).subscribe(eventos => {
      // Reiniciar eventos de cada día
      this.diasSemana.forEach(dia => {
        dia.eventos = [];
      });
      
      // Asignar eventos a los días correspondientes
      eventos.forEach(evento => {
        const fechaEvento = new Date(evento.fecha);
        const diaSemana = this.diasSemana.find(d => 
          d.fecha.getDate() === fechaEvento.getDate() &&
          d.fecha.getMonth() === fechaEvento.getMonth() &&
          d.fecha.getFullYear() === fechaEvento.getFullYear()
        );
        
        if (diaSemana) {
          diaSemana.eventos.push(evento);
        }
      });
      
      // Ordenar eventos por hora
      this.diasSemana.forEach(dia => {
        dia.eventos.sort((a, b) => {
          if (!a.horaInicio) return 1;
          if (!b.horaInicio) return -1;
          return a.horaInicio.localeCompare(b.horaInicio);
        });
      });
    });
  }

  semanaAnterior(): void {
    const nuevaFecha = new Date(this.semanaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    this.semanaActual = nuevaFecha;
    this.generarDiasSemana();
    this.cargarEventos();
  }

  semanaSiguiente(): void {
    const nuevaFecha = new Date(this.semanaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    this.semanaActual = nuevaFecha;
    this.generarDiasSemana();
    this.cargarEventos();
  }

  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getFullYear() === hoy.getFullYear();
  }

  formatoFecha(fecha: Date): string {
    const opciones: Intl.DateTimeFormatOptions = { 
      day: '2-digit',
      month: '2-digit'
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  formatoSemana(): string {
    const primerDia = this.diasSemana[0].fecha;
    const ultimoDia = this.diasSemana[6].fecha;
    
    const primerDiaFormato = primerDia.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: 'short'
    });
    
    const ultimoDiaFormato = ultimoDia.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    return `${primerDiaFormato} - ${ultimoDiaFormato}`;
  }

  crearEvento(fecha: Date): void {
    const dialogRef = this.dialog.open(EventoDialogComponent, {
      width: '500px',
      data: { 
        evento: {
          fecha: fecha,
          esCitacionJuicio: false
        }, 
        modoEdicion: true,
        esNuevo: true
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado && resultado.evento) {
        this.agendaService.agregarEvento(resultado.evento).subscribe(
          nuevoEvento => {
            this.snackBar.open('Evento creado correctamente', 'Cerrar', { duration: 3000 });
            this.cargarEventos();
          },
          error => {
            this.snackBar.open('Error al crear el evento', 'Cerrar', { duration: 3000 });
          }
        );
      }
    });
  }

  verEvento(evento: Evento, event: MouseEvent): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(EventoDialogComponent, {
      width: '500px',
      data: { 
        evento,
        modoEdicion: false
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado && resultado.accion === 'editar') {
        this.editarEvento(evento);
      }
    });
  }

  editarEvento(evento: Evento): void {
    const dialogRef = this.dialog.open(EventoDialogComponent, {
      width: '500px',
      data: { 
        evento,
        modoEdicion: true
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        if (resultado.accion === 'actualizar') {
          this.agendaService.actualizarEvento(resultado.evento).subscribe(
            () => {
              this.snackBar.open('Evento actualizado correctamente', 'Cerrar', { duration: 3000 });
              this.cargarEventos();
            },
            error => {
              this.snackBar.open('Error al actualizar el evento', 'Cerrar', { duration: 3000 });
            }
          );
        } else if (resultado.accion === 'eliminar') {
          this.agendaService.eliminarEvento(evento.id).subscribe(
            () => {
              this.snackBar.open('Evento eliminado correctamente', 'Cerrar', { duration: 3000 });
              this.cargarEventos();
            },
            error => {
              this.snackBar.open('Error al eliminar el evento', 'Cerrar', { duration: 3000 });
            }
          );
        }
      }
    });
  }
}