import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Evento {
  id: string;
  titulo: string;
  fecha: Date;
  horaInicio?: string;
  horaFin?: string;
  descripcion?: string;
  direccionJuzgado?: string;
  observaciones?: string;
  esCitacionJuicio: boolean;
  episodioId?: string;
  sujetoId?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private eventosSubject = new BehaviorSubject<Evento[]>([]);
  private eventos: Evento[] = [];

  constructor() {
    // Datos de ejemplo para desarrollo
    this.cargarEventosIniciales();
  }

  private cargarEventosIniciales(): void {
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    const proximaSemana = new Date(hoy);
    proximaSemana.setDate(hoy.getDate() + 7);

    this.eventos = [
      {
        id: '1',
        titulo: 'Citación a juicio',
        fecha: manana,
        horaInicio: '10:00',
        horaFin: '11:30',
        descripcion: 'Citación a juicio para caso EP123456',
        direccionJuzgado: 'Juzgado de Primera Instancia Nº 3, C/ Ejemplo 123',
        observaciones: 'Llevar toda la documentación relacionada',
        esCitacionJuicio: true,
        episodioId: 'EP123456',
        sujetoId: 'S001',
        color: '#e57373'
      },
      {
        id: '2',
        titulo: 'Reunión equipo forense',
        fecha: hoy,
        horaInicio: '12:00',
        horaFin: '13:00',
        descripcion: 'Reunión mensual del equipo',
        esCitacionJuicio: false,
        color: '#81c784'
      },
      {
        id: '3',
        titulo: 'Formación SVM-RD 32/2009',
        fecha: proximaSemana,
        horaInicio: '09:00',
        horaFin: '14:00',
        descripcion: 'Sesión formativa sobre protocolo SVM',
        esCitacionJuicio: false,
        color: '#64b5f6'
      }
    ];

    this.actualizarEventos();
  }

  private actualizarEventos(): void {
    this.eventosSubject.next([...this.eventos]);
  }

  getEventos(): Observable<Evento[]> {
    return this.eventosSubject.asObservable();
  }

  getEventosPorMes(anio: number, mes: number): Observable<Evento[]> {
    return this.eventosSubject.pipe(
      map(eventos => eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getFullYear() === anio && fechaEvento.getMonth() === mes;
      }))
    );
  }

  getEventosPorSemana(fecha: Date): Observable<Evento[]> {
    // Obtener el primer día de la semana (lunes)
    const primerDiaSemana = new Date(fecha);
    primerDiaSemana.setDate(fecha.getDate() - fecha.getDay() + (fecha.getDay() === 0 ? -6 : 1));
    
    // Obtener el último día de la semana (domingo)
    const ultimoDiaSemana = new Date(primerDiaSemana);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);

    return this.eventosSubject.pipe(
      map(eventos => eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento >= primerDiaSemana && fechaEvento <= ultimoDiaSemana;
      }))
    );
  }

  getEventosPorDia(fecha: Date): Observable<Evento[]> {
    return this.eventosSubject.pipe(
      map(eventos => eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getDate() === fecha.getDate() &&
               fechaEvento.getMonth() === fecha.getMonth() &&
               fechaEvento.getFullYear() === fecha.getFullYear();
      }))
    );
  }

  getEvento(id: string): Observable<Evento | undefined> {
    return of(this.eventos.find(evento => evento.id === id));
  }

  agregarEvento(evento: Omit<Evento, 'id'>): Observable<Evento> {
    const nuevoEvento: Evento = {
      ...evento,
      id: this.generarId()
    };
    
    this.eventos.push(nuevoEvento);
    this.actualizarEventos();
    return of(nuevoEvento);
  }

  actualizarEvento(evento: Evento): Observable<Evento> {
    const index = this.eventos.findIndex(e => e.id === evento.id);
    if (index !== -1) {
      this.eventos[index] = evento;
      this.actualizarEventos();
    }
    return of(evento);
  }

  eliminarEvento(id: string): Observable<boolean> {
    const index = this.eventos.findIndex(e => e.id === id);
    if (index !== -1) {
      this.eventos.splice(index, 1);
      this.actualizarEventos();
      return of(true);
    }
    return of(false);
  }

  agregarCitacionJuicio(citacion: {
    sujetoId: string;
    peritoId: string;
    fechaCitacion: Date;
    direccionJuzgado?: string;
    observaciones?: string;
    episodioId: string;
  }): Observable<Evento> {
    const nuevaCitacion: Evento = {
      id: this.generarId(),
      titulo: 'Citación a juicio',
      fecha: citacion.fechaCitacion,
      horaInicio: citacion.fechaCitacion.toTimeString().substring(0, 5),
      descripcion: `Citación a juicio para caso ${citacion.episodioId}`,
      direccionJuzgado: citacion.direccionJuzgado,
      observaciones: citacion.observaciones,
      esCitacionJuicio: true,
      episodioId: citacion.episodioId,
      sujetoId: citacion.sujetoId,
      color: '#e57373'
    };
    
    this.eventos.push(nuevaCitacion);
    this.actualizarEventos();
    return of(nuevaCitacion);
  }

  private generarId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}