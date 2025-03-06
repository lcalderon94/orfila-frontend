import { Component, OnInit, OnDestroy } from '@angular/core';
import { AgendaService, Evento } from '../../../services/agenda.service';
import { MatDialog } from '@angular/material/dialog';
import { EventoDialogComponent } from '../evento-dialog/evento-dialog.component';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface DiaCalendario {
  fecha: Date;
  esDelMesActual: boolean;
  eventos: Evento[];
}

@Component({
  selector: 'app-agenda-mensual',
  templateUrl: './agenda-mensual.component.html',
  styleUrls: ['./agenda-mensual.component.css']
})
export class AgendaMensualComponent implements OnInit, OnDestroy {
  fechaActual: Date = new Date();
  diasSemana: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  
  diasCalendario: DiaCalendario[] = [];
  private eventosSubscription: Subscription | null = null;

  constructor(
    private agendaService: AgendaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.generarCalendario();
    this.cargarEventos();
  }

  ngOnDestroy(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }

  generarCalendario(): void {
    const primerDiaMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0);
    
    // Ajustar para que la semana comience en lunes (1) en lugar de domingo (0)
    let diaSemanaInicio = primerDiaMes.getDay() || 7; // Convertir 0 (domingo) a 7
    diaSemanaInicio--; // Restar 1 para que lunes sea 0
    
    // Días del mes anterior para completar la primera semana
    const diasPrevios: DiaCalendario[] = [];
    for (let i = diaSemanaInicio - 1; i >= 0; i--) {
      const fecha = new Date(primerDiaMes);
      fecha.setDate(fecha.getDate() - i - 1);
      diasPrevios.push({
        fecha,
        esDelMesActual: false,
        eventos: []
      });
    }
    
    // Días del mes actual
    const diasActuales: DiaCalendario[] = [];
    for (let i = 1; i <= ultimoDiaMes.getDate(); i++) {
      diasActuales.push({
        fecha: new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), i),
        esDelMesActual: true,
        eventos: []
      });
    }
    
    // Días del mes siguiente para completar la última semana
    const diasSiguientes: DiaCalendario[] = [];
    const totalDias = diasPrevios.length + diasActuales.length;
    const diasFaltantes = 42 - totalDias; // 6 semanas x 7 días = 42
    
    for (let i = 1; i <= diasFaltantes; i++) {
      const fecha = new Date(ultimoDiaMes);
      fecha.setDate(fecha.getDate() + i);
      diasSiguientes.push({
        fecha,
        esDelMesActual: false,
        eventos: []
      });
    }
    
    this.diasCalendario = [...diasPrevios, ...diasActuales, ...diasSiguientes];
  }

  cargarEventos(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
    
    this.eventosSubscription = this.agendaService.getEventos().subscribe(eventos => {
      // Reiniciar eventos de cada día
      this.diasCalendario.forEach(dia => {
        dia.eventos = [];
      });
      
      // Asignar eventos a los días correspondientes
      eventos.forEach(evento => {
        const fechaEvento = new Date(evento.fecha);
        const diaCalendario = this.diasCalendario.find(d => 
          d.fecha.getDate() === fechaEvento.getDate() &&
          d.fecha.getMonth() === fechaEvento.getMonth() &&
          d.fecha.getFullYear() === fechaEvento.getFullYear()
        );
        
        if (diaCalendario) {
          diaCalendario.eventos.push(evento);
        }
      });
    });
  }

  mesAnterior(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 1, 1);
    this.generarCalendario();
    this.cargarEventos();
  }

  mesSiguiente(): void {
    this.fechaActual = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 1);
    this.generarCalendario();
    this.cargarEventos();
  }

  esHoy(fecha: Date): boolean {
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
           fecha.getMonth() === hoy.getMonth() &&
           fecha.getFullYear() === hoy.getFullYear();
  }

  verEvento(evento: Evento): void {
    this.dialog.open(EventoDialogComponent, {
      width: '500px',
      data: { evento, modoEdicion: false }
    });
  }

  crearEvento(fecha: Date, event: MouseEvent): void {
    event.preventDefault(); // Prevenir el menú contextual del navegador
    
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

  mostrarMenuContextual(dia: DiaCalendario, event: MouseEvent): void {
    event.preventDefault();
    this.crearEvento(dia.fecha, event);
  }

  actualizarEvento(evento: Evento, event: MouseEvent): void {
    event.stopPropagation(); // Evitar que se abra el menú contextual
    const dialogRef = this.dialog.open(EventoDialogComponent, {
      width: '500px',
      data: { evento, modoEdicion: true }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado && resultado.accion) {
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