import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MockAuthService } from './mock-auth.service';
import { MOCK_EPISODIOS, MOCK_SUJETOS } from '../mock-data/episodios.mock';


export interface Episodio {
  nEpisodio: string;
  tipoSolicitante: string;
  direccionSubdireccion: string;
  tipoOrganismo: string;
  organismo: string;
  tipoProcedimiento: string;
  nAnio: string;
  anio: string;
  numeroAtestadoAnio: string;
  anioAtestado: string;
  fechaHecho: string;
  nig: string[];
  juzgadoGuardia: boolean;
  violenciaGenero: boolean;
  testigoProtegido: boolean;
  causaConPreso: boolean;
  secretoSumario: boolean;
  violenciaDomestica: boolean;
  urgente: boolean;
  descripcionEpisodio: string;
  organoAseguradora: string;
  admResponsable: string;
  nExpediente: string;
  sujeto: string;
}

export interface NotaEpisodio {
  id: number;
  episodioId: string;
  contenido: string;
  fechaCreacion: Date;
  usuario: string;
}

export interface Sujeto {
  nombreIml: string;
  numExpediente: string;
  tipoIdentificacion: string;
  numIdentificacion: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento?: string | Date;
  unificado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EpisodiosService {
  private episodiosSubject: BehaviorSubject<Episodio[]>;
  private notasMap: Map<string, NotaEpisodio[]> = new Map();
  private sujetosMap: Map<string, Sujeto[]>;

  constructor(private mockAuthService: MockAuthService) {
    this.episodiosSubject = new BehaviorSubject<Episodio[]>(MOCK_EPISODIOS);
    this.sujetosMap = MOCK_SUJETOS;
  }


  getSujetosEpisodio(nEpisodio: string): Observable<Sujeto[]> {
    return new Observable(observer => {
      const sujetos = this.sujetosMap.get(nEpisodio) || [];
      observer.next(sujetos);
      observer.complete();
    });
  }

  getEpisodios(): Observable<Episodio[]> {
    return this.episodiosSubject.asObservable();
  }

  getEpisodioById(nEpisodio: string): Observable<Episodio | undefined> {
    return this.episodiosSubject.pipe(
      map(episodios => episodios.find(ep => ep.nEpisodio === nEpisodio))
    );
  }

  actualizarEpisodio(episodioActualizado: Episodio): Observable<void> {
    return new Observable(observer => {
      const episodios = this.episodiosSubject.value;
      const index = episodios.findIndex(ep => ep.nEpisodio === episodioActualizado.nEpisodio);
      if (index !== -1) {
        episodios[index] = episodioActualizado;
        this.episodiosSubject.next(episodios);
        observer.next();
        observer.complete();
      } else {
        observer.error('Episodio no encontrado');
      }
    });
  }

  crearEpisodio(nuevoEpisodio: Episodio): Observable<void> {
    return new Observable(observer => {
      const episodios = this.episodiosSubject.value;
      episodios.push(nuevoEpisodio);
      this.episodiosSubject.next(episodios);
      observer.next();
      observer.complete();
    });
  }

  eliminarEpisodio(nEpisodio: string): Observable<void> {
    return new Observable(observer => {
      const episodios = this.episodiosSubject.value;
      const index = episodios.findIndex(ep => ep.nEpisodio === nEpisodio);
      if (index !== -1) {
        episodios.splice(index, 1);
        this.episodiosSubject.next(episodios);
        observer.next();
        observer.complete();
      } else {
        observer.error('Episodio no encontrado');
      }
    });
  }

  getNotasEpisodio(episodioId: string): Observable<NotaEpisodio[]> {
    return new Observable(observer => {
      const notas = this.notasMap.get(episodioId) || [];
      observer.next(notas);
      observer.complete();
    });
  }

  agregarNotaEpisodio(episodioId: string, contenido: string): Observable<void> {
    return new Observable(observer => {
      this.mockAuthService.getCurrentProfile().pipe(
        take(1)
      ).subscribe(userProfile => {
        const notas = this.notasMap.get(episodioId) || [];
        const nuevaNota: NotaEpisodio = {
          id: Date.now(),
          episodioId,
          contenido,
          fechaCreacion: new Date(),
          usuario: userProfile ? `${userProfile.nombre} ${userProfile.apellidos}` : 'Usuario Desconocido'
        };
        notas.push(nuevaNota);
        this.notasMap.set(episodioId, notas);
        observer.next();
        observer.complete();
      });
    });
  }

  eliminarNotaEpisodio(episodioId: string, notaId: number): Observable<void> {
    return new Observable(observer => {
      const notas = this.notasMap.get(episodioId) || [];
      const notasActualizadas = notas.filter(nota => nota.id !== notaId);
      this.notasMap.set(episodioId, notasActualizadas);
      observer.next();
      observer.complete();
    });
  }
}