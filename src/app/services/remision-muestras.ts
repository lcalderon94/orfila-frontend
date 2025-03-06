import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RemisionMuestrasData {
  // Datos básicos del informe
  categoria: string;
  tipo: string;
  nombre: string;
  sujeto: any;
  
  // Datos del solicitante
  esProcedimientoJudicial: boolean;
  destinatario: string;
  organo: string;
  tipoReferencia: string;
  numero: string;
  referenciaRemitente: string;
  responsableSolicitud: string;
  
  // Datos del asunto
  asuntoContenido: string;
  
  // Estudios solicitados
  tipoAsunto: string;
  tipoEstudio: string;
  tipoProcedimiento: string;
  asuntos: string[];
  estudios: string[];
  
  // Sujetos de estudio
  sujetosEstudio: any[];
  
  // Muestras para estudio
  muestras: {
    identificacion: string;
    conservante: string;
    fechaExtraccion: Date | null;
    fechaDestruccion: Date | null;
    descripcion: string;
    tipoMuestra1: string;
    tipoMuestra2: string;
    tipoMuestra3: string;
  }[];
  
  // Cadena de custodia
  cadenaCustodia: {
    nombreDocumento: string;
    organismoActividad: string;
    fecha: Date | null;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class RemisionMuestrasService {
  private pasoActualSubject = new BehaviorSubject<number>(1);
  private datosInformeSubject = new BehaviorSubject<RemisionMuestrasData>({
    // Valores iniciales vacíos
    categoria: '',
    tipo: '',
    nombre: '',
    sujeto: null,
    esProcedimientoJudicial: true,
    destinatario: 'INTCF. Departamento de Madrid',
    organo: '',
    tipoReferencia: '',
    numero: '',
    referenciaRemitente: '',
    responsableSolicitud: '',
    asuntoContenido: '',
    tipoAsunto: '',
    tipoEstudio: '',
    tipoProcedimiento: '',
    asuntos: [],
    estudios: [],
    sujetosEstudio: [],
    muestras: [],
    cadenaCustodia: []
  });

  constructor() {}

  get pasoActual$(): Observable<number> {
    return this.pasoActualSubject.asObservable();
  }

  get datosInforme$(): Observable<RemisionMuestrasData> {
    return this.datosInformeSubject.asObservable();
  }

  get datosInforme(): RemisionMuestrasData {
    return this.datosInformeSubject.value;
  }

  // Método para inicializar con datos de un documento existente
  inicializarConDocumento(documento: any): void {
    const datosActuales = this.datosInformeSubject.value;
    this.datosInformeSubject.next({
      ...datosActuales,
      categoria: documento.categoria || datosActuales.categoria,
      tipo: documento.tipo || datosActuales.tipo,
      nombre: documento.nombre || datosActuales.nombre,
      sujeto: documento.sujeto || datosActuales.sujeto
    });
  }

  avanzarPaso(): void {
    const pasoActual = this.pasoActualSubject.value;
    if (pasoActual < 7) {
      this.pasoActualSubject.next(pasoActual + 1);
    }
  }

  retrocederPaso(): void {
    const pasoActual = this.pasoActualSubject.value;
    if (pasoActual > 1) {
      this.pasoActualSubject.next(pasoActual - 1);
    }
  }

  irAPaso(paso: number): void {
    if (paso >= 1 && paso <= 7) {
      this.pasoActualSubject.next(paso);
    }
  }

  actualizarDatos(datos: Partial<RemisionMuestrasData>): void {
    const datosActuales = this.datosInformeSubject.value;
    this.datosInformeSubject.next({
      ...datosActuales,
      ...datos
    });
  }

  reiniciarDatos(): void {
    this.pasoActualSubject.next(1);
    this.datosInformeSubject.next({
      categoria: '',
      tipo: '',
      nombre: '',
      sujeto: null,
      esProcedimientoJudicial: true,
      destinatario: 'INTCF. Departamento de Madrid',
      organo: '',
      tipoReferencia: '',
      numero: '',
      referenciaRemitente: '',
      responsableSolicitud: '',
      asuntoContenido: '',
      tipoAsunto: '',
      tipoEstudio: '',
      tipoProcedimiento: '',
      asuntos: [],
      estudios: [],
      sujetosEstudio: [],
      muestras: [],
      cadenaCustodia: []
    });
  }

  generarInforme(): Observable<any> {
    // En una implementación real, aquí conectaríamos con el backend
    // Para este prototipo, simplemente devolvemos los datos actuales
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          informe: this.datosInformeSubject.value
        });
        observer.complete();
      }, 1500); // Simulamos un delay de 1.5 segundos
    });
  }
}