import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgendaService, Evento } from '../../../services/agenda.service';
import { MatDialog } from '@angular/material/dialog';
import { EventoDialogComponent } from '../evento-dialog/evento-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

interface Hora {
  valor: string;
  eventos: {[key: number]: Evento[]};
}

@Component({
  selector: 'app-agenda-horaria',
  templateUrl: './agenda-horaria.component.html',
  styleUrls: ['./agenda-horaria.component.css']
})
export class AgendaHorariaComponent implements OnInit, OnDestroy {
  fechaActual: Date = new Date();
  diasSemana: Date[] = [];
  horas: Hora[] = [];
  nombresDias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
  private eventosSubscription: Subscription | null = null;

  constructor(
    private agendaService: AgendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generarDiasSemana();
    this.generarHoras();
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }

  generarDiasSemana(): void {
    const fechaActual = new Date(this.fechaActual);
    
    // Encontrar el lunes de la semana actual
    const diaSemana = fechaActual.getDay() || 7; // 0 es domingo, lo convertimos a 7
    fechaActual.setDate(fechaActual.getDate() - (diaSemana - 1)); // Retroceder al lunes
    
    this.diasSemana = [];
    
    // Generar los 7 días de la semana
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(fechaActual);
      fecha.setDate(fecha.getDate() + i);
      this.diasSemana.push(fecha);
    }
  }

  generarHoras(): void {
    this.horas = [];
    for (let i = 8; i <= 20; i++) { // De 8:00 a 20:00
      const hora = i < 10 ? `0${i}:00` : `${i}:00`;
      const eventosHora: {[key: number]: Evento[]} = {};
      
      // Inicializar arrays vacíos para cada día de la semana
      for (let j = 0; j < 7; j++) {
        eventosHora[j] = [];
      }
      
      this.horas.push({
        valor: hora,
        eventos: eventosHora
      });
    }
  }

  cargarEventos(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
    
    this.eventosSubscription = this.agendaService.getEventosPorSemana(this.fechaActual).subscribe(eventos => {
      // Reiniciar eventos de cada hora y día
      this.horas.forEach(hora => {
        for (let i = 0; i < 7; i++) {
          hora.eventos[i] = [];
        }
      });
      
      // Asignar eventos a los días y horas correspondientes
      eventos.forEach(evento => {
        if (!evento.horaInicio) return;
        
        const fechaEvento = new Date(evento.fecha);
        const diaIndex = this.diasSemana.findIndex(d => 
          d.getDate() === fechaEvento.getDate() &&
          d.getMonth() === fechaEvento.getMonth() &&
          d.getFullYear() === fechaEvento.getFullYear()
        );
        
        if (diaIndex === -1) return;
        
        const horaEvento = parseInt(evento.horaInicio.split(':')[0]);
        const horaIndex = this.horas.findIndex(h => parseInt(h.valor.split(':')[0]) === horaEvento);
        
        if (horaIndex !== -1) {
          this.horas[horaIndex].eventos[diaIndex].push(evento);
        }
      });
    });
  }

  semanaAnterior(): void {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() - 7);
    this.fechaActual = nuevaFecha;
    this.generarDiasSemana();
    this.cargarEventos();
  }

  semanaSiguiente(): void {
    const nuevaFecha = new Date(this.fechaActual);
    nuevaFecha.setDate(nuevaFecha.getDate() + 7);
    this.fechaActual = nuevaFecha;
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
    const primerDia = this.diasSemana[0];
    const ultimoDia = this.diasSemana[6];
    
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

  crearEvento(fecha: Date, hora: string): void {
    const fechaHora = new Date(fecha);
    const horaNum = parseInt(hora.split(':')[0]);
    fechaHora.setHours(horaNum, 0, 0, 0);
    
    const dialogRef = this.dialog.open(EventoDialogComponent, {
      width: '500px',
      data: { 
        evento: {
          fecha: fechaHora,
          horaInicio: hora,
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