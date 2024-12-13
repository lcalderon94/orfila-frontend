import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
  
  constructor() {
    // Inicializar con algunos datos de ejemplo
    const episodiosIniciales: Episodio[] = [
      {
        nEpisodio: 'EP81180',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        tipoOrganismo: 'Juzgado de lo Penal',
        organismo: 'Jdo. de lo Penal Nº 1 de Avila (Ávila)',
        tipoProcedimiento: 'Procedimiento Abreviado',
        nAnio: '123',
        anio: '2023',
        numeroAtestadoAnio: '456',
        anioAtestado: '2023',
        fechaHecho: '2023-05-15',
        nig: ['2807900', '220', '0000123', '2023', 'PA'],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: 'Descripción del episodio de ejemplo',
        organoAseguradora: 'Jdo. de lo Penal Nº 1 de Avila (Ávila)',
        admResponsable: '02460888A',
        nExpediente: 'EX2013550',
        sujeto: 'Juan Pérez'
      },
      {
        nEpisodio: 'EP81175',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoOrganismo: 'Juzgado',
        organismo: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoProcedimiento: 'ABS - Abstención / Recusación Jueces',
        nAnio: '1234591',
        anio: '2022',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2022-07-15 09:15',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'Sección 1ª de la A. Prov. Ciudad Real',
        admResponsable: '02468888H',
        nExpediente: 'EX2013547',
        sujeto: 'Amadorrr Rivas Merengue'
      },
      {
        nEpisodio: 'EP81173',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoOrganismo: 'Juzgado',
        organismo: 'Sección 1ª de la A. Prov. Ciudad Real',
        tipoProcedimiento: 'ABS - Abstención / Recusación Jueces',
        nAnio: '1234599',
        anio: '2022',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '2022-07-05 08:01',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'Sección 1ª de la A. Prov. Ciudad Real',
        admResponsable: 'EX2013546',
        nExpediente: 'EX2013546',
        sujeto: 'Antonio Sanche Trolas'
      },
      {
        nEpisodio: 'EP81171',
        tipoSolicitante: 'Aseguradora',
        direccionSubdireccion: 'ZURICH INSURANCE PLC.',
        tipoOrganismo: 'Aseguradora',
        organismo: 'ZURICH INSURANCE PLC. - VIA AUGUSTA, 200 08021 BARCELONA',
        tipoProcedimiento: 'ABS - Abstención / Recusación Secretarios Judiciales',
        nAnio: '',
        anio: '',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'ZURICH INSURANCE PLC.',
        admResponsable: '',
        nExpediente: 'EX2013543',
        sujeto: 'Jimmy Floyd Hasselbaink'
      },
      {
        nEpisodio: 'EP81168',
        tipoSolicitante: 'juzgado',
        direccionSubdireccion: 'Sección 1ª de la A. Prov. Albacete',
        tipoOrganismo: 'Juzgado',
        organismo: 'Sección 1ª de la A. Prov. Albacete',
        tipoProcedimiento: 'ASS - Abstención Secretarios Judiciales',
        nAnio: '',
        anio: '',
        numeroAtestadoAnio: '',
        anioAtestado: '',
        fechaHecho: '',
        nig: [],
        juzgadoGuardia: false,
        violenciaGenero: false,
        testigoProtegido: false,
        causaConPreso: false,
        secretoSumario: false,
        violenciaDomestica: false,
        urgente: false,
        descripcionEpisodio: '',
        organoAseguradora: 'Sección 1ª de la A. Prov. Albacete',
        admResponsable: '',
        nExpediente: 'EX2013541',
        sujeto: 'Luis'
      }
    ];
    
    this.episodiosSubject = new BehaviorSubject<Episodio[]>(episodiosIniciales);
  }

  private sujetosMap: Map<string, Sujeto[]> = new Map([
    ['EP81180', [
      {
        nombreIml: 'IML y CCrF de Palencia, Salamanca y Valladolid',
        numExpediente: 'EX2013550',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '12345678A',
        nombre: 'Juan',
        apellido1: 'Pérez',
        apellido2: 'García',
        fechaNacimiento: '1980-01-01'
      }
    ]],
    ['EP81175', [
      {
        nombreIml: 'Sección 1ª de la A. Prov. Ciudad Real',
        numExpediente: 'EX2013547',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '87654321B',
        nombre: 'Amadorrr',
        apellido1: 'Rivas',
        apellido2: 'Merengue',
        fechaNacimiento: '1990-12-25'
      }
    ]],
    ['EP81173', [
      {
        nombreIml: 'Sección 1ª de la A. Prov. Ciudad Real',
        numExpediente: 'EX2013546',
        tipoIdentificacion: 'DNI',
        numIdentificacion: '11111111C',
        nombre: 'Antonio',
        apellido1: 'Sanche',
        apellido2: 'Trolas',
        fechaNacimiento: '1985-06-15'
      }
    ]]
  ]);

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

  // Puedes añadir más métodos según sea necesario, como filtrar episodios, etc.
}