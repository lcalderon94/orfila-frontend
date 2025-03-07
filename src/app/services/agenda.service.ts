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
    // Cargamos eventos iniciales con fechas específicas (no relativas)
    this.cargarEventosIniciales();
  }

  private cargarEventosIniciales(): void {
    // Definimos fechas específicas para los eventos de ejemplo en lugar de fechas relativas
    // Primer ejemplo: fecha fija en marzo 2025
    const fechaCitacion = new Date(2025, 2, 7); // 7 de marzo de 2025
    const fechaReunion = new Date(2025, 2, 6); // 6 de marzo de 2025
    const fechaFormacion = new Date(2025, 2, 14); // 14 de marzo de 2025

    this.eventos = [
      {
        id: '1',
        titulo: 'Citación a juicio',
        fecha: fechaCitacion,
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
        fecha: fechaReunion,
        horaInicio: '12:00',
        horaFin: '13:00',
        descripcion: 'Reunión mensual del equipo',
        esCitacionJuicio: false,
        color: '#81c784'
      },
      {
        id: '3',
        titulo: 'Formación SVM-RD 32/2009',
        fecha: fechaFormacion,
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

  getEventosPorMes(fecha: Date): Observable<Evento[]> {
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth();

    return this.eventosSubject.pipe(
      map(eventos => eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento.getFullYear() === anio && fechaEvento.getMonth() === mes;
      }))
    );
  }

  getEventosPorSemana(fecha: Date): Observable<Evento[]> {
    // Calculamos correctamente el primer día de la semana (lunes)
    const primerDiaSemana = new Date(fecha);
    const diaSemana = fecha.getDay() || 7; // 0 es domingo, lo convertimos a 7
    primerDiaSemana.setDate(fecha.getDate() - (diaSemana - 1));
    
    // Establecemos hora, minutos y segundos a 0 para comparar solo fechas
    primerDiaSemana.setHours(0, 0, 0, 0);
    
    // Calculamos el último día de la semana (domingo)
    const ultimoDiaSemana = new Date(primerDiaSemana);
    ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
    ultimoDiaSemana.setHours(23, 59, 59, 999); // Final del día

    return this.eventosSubject.pipe(
      map(eventos => eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        // Comparamos solo la parte de fecha
        return fechaEvento >= primerDiaSemana && fechaEvento <= ultimoDiaSemana;
      }))
    );
  }

  getEventosPorDia(fecha: Date): Observable<Evento[]> {
    // Creamos una nueva fecha para no modificar la original
    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);
    
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    return this.eventosSubject.pipe(
      map(eventos => eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return fechaEvento >= inicioDia && fechaEvento <= finDia;
      }))
    );
  }

  getEvento(id: string): Observable<Evento | undefined> {
    return of(this.eventos.find(evento => evento.id === id));
  }

  agregarEvento(evento: Omit<Evento, 'id'>): Observable<Evento> {
    // Aseguramos que la fecha es un objeto Date
    const fechaEvento = evento.fecha instanceof Date ? 
      new Date(evento.fecha) : 
      new Date(evento.fecha);
    
    const nuevoEvento: Evento = {
      ...evento,
      fecha: fechaEvento,
      id: this.generarId()
    };
    
    this.eventos.push(nuevoEvento);
    this.actualizarEventos();
    return of(nuevoEvento);
  }

  actualizarEvento(evento: Evento): Observable<Evento> {
    // Aseguramos que la fecha es un objeto Date
    const eventoActualizado = {
      ...evento,
      fecha: evento.fecha instanceof Date ? 
        new Date(evento.fecha) : 
        new Date(evento.fecha)
    };
    
    const index = this.eventos.findIndex(e => e.id === eventoActualizado.id);
    if (index !== -1) {
      this.eventos[index] = eventoActualizado;
      this.actualizarEventos();
    }
    return of(eventoActualizado);
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
    // Creamos una copia de la fecha
    const fechaCitacion = new Date(citacion.fechaCitacion);
    
    const nuevaCitacion: Evento = {
      id: this.generarId(),
      titulo: 'Citación a juicio',
      fecha: fechaCitacion,
      horaInicio: fechaCitacion.getHours().toString().padStart(2, '0') + ':' + 
                 fechaCitacion.getMinutes().toString().padStart(2, '0'),
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