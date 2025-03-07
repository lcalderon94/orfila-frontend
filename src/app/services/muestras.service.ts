// muestras.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


export interface Localizacion {
  id?: number;
  tipoLocalizacion: string;
  etiquetaLocalizacion: string;
  sedeCP: string;
  plantaEdificio?: string;
  numeroIncremental: string;
  descripcionLocalizacion: string;
  codigoBarras: string;
  tieneMuestras?: boolean;
  porDefecto?: boolean | string;
}


export interface Muestra {
  id?: number;
  codigoBarras: string;
  fechaRegistro: Date;
  usuario: string;
  localizacion: Localizacion;
  descripcion?: string;
  imagen?: string;
  episodioId?: number;
  episodioNumero?: string;
  sujetoId?: number;
  sujetoNombre?: string;
}

export interface Carga {
  id: number;
  fechaCarga: Date;
  numeroDeMuestras: number;
  usuarioCarga: string;
  procesada: boolean;
  registros: Array<{
    codigoBarrasLocalizacion: string;
    descripcionLocalizacion: string;
    fechaRegistro: Date;
    codigoBarrasMuestra: string;
    usuario: string;
    estado: 'correcto' | 'existente' | 'error';
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class MuestrasService {
  private apiUrl = '/api/muestras'; // URL base para las peticiones API

  constructor(private http: HttpClient) { }

  // === LOCALIZACIONES ===

  getLocalizaciones(filtros?: any): Observable<Localizacion[]> {
    const params = filtros ? { ...filtros } : {};
    return this.http.get<Localizacion[]>(`${this.apiUrl}/localizaciones`, { params })
      .pipe(
        catchError(this.handleError<Localizacion[]>('getLocalizaciones', []))
      );
  }

  getLocalizacion(id: number): Observable<Localizacion> {
    return this.http.get<Localizacion>(`${this.apiUrl}/localizaciones/${id}`)
      .pipe(
        catchError(this.handleError<Localizacion>('getLocalizacion'))
      );
  }

  crearLocalizacion(localizacion: Localizacion): Observable<Localizacion> {
    return this.http.post<Localizacion>(`${this.apiUrl}/localizaciones`, localizacion)
      .pipe(
        catchError(this.handleError<Localizacion>('crearLocalizacion'))
      );
  }

  actualizarLocalizacion(localizacion: Localizacion): Observable<Localizacion> {
    return this.http.put<Localizacion>(`${this.apiUrl}/localizaciones/${localizacion.id}`, localizacion)
      .pipe(
        catchError(this.handleError<Localizacion>('actualizarLocalizacion'))
      );
  }

  eliminarLocalizacion(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/localizaciones/${id}`)
      .pipe(
        map(() => true),
        catchError(this.handleError<boolean>('eliminarLocalizacion', false))
      );
  }

  getPlantas(): Observable<string[]> {
    return of(['000', '001', '002', '003', '004']); // Plantas de ejemplo
  }

  // === MUESTRAS ===

  getMuestras(filtros?: any): Observable<Muestra[]> {
    const params = filtros ? { ...filtros } : {};
    return this.http.get<Muestra[]>(`${this.apiUrl}/muestras`, { params })
      .pipe(
        catchError(this.handleError<Muestra[]>('getMuestras', []))
      );
  }

  getMuestra(id: number): Observable<Muestra> {
    return this.http.get<Muestra>(`${this.apiUrl}/muestras/${id}`)
      .pipe(
        catchError(this.handleError<Muestra>('getMuestra'))
      );
  }

  registrarMuestra(muestra: Muestra): Observable<Muestra> {
    return this.http.post<Muestra>(`${this.apiUrl}/muestras`, muestra)
      .pipe(
        catchError(this.handleError<Muestra>('registrarMuestra'))
      );
  }

  actualizarMuestra(muestra: Muestra): Observable<Muestra> {
    return this.http.put<Muestra>(`${this.apiUrl}/muestras/${muestra.id}`, muestra)
      .pipe(
        catchError(this.handleError<Muestra>('actualizarMuestra'))
      );
  }

  eliminarMuestra(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/muestras/${id}`)
      .pipe(
        map(() => true),
        catchError(this.handleError<boolean>('eliminarMuestra', false))
      );
  }

  getMuestrasPorLocalizacion(localizacionId: number): Observable<Muestra[]> {
    return this.http.get<Muestra[]>(`${this.apiUrl}/localizaciones/${localizacionId}/muestras`)
      .pipe(
        catchError(this.handleError<Muestra[]>('getMuestrasPorLocalizacion', []))
      );
  }

  // === CARGA DE CÓDIGOS ===

  guardarCarga(registros: any[]): Observable<Carga> {
    return this.http.post<Carga>(`${this.apiUrl}/cargas`, { registros })
      .pipe(
        catchError(this.handleError<Carga>('guardarCarga'))
      );
  }

  procesarCarga(cargaId: number): Observable<Carga> {
    return this.http.post<Carga>(`${this.apiUrl}/cargas/${cargaId}/procesar`, {})
      .pipe(
        catchError(this.handleError<Carga>('procesarCarga'))
      );
  }

  getCargas(filtros?: any): Observable<Carga[]> {
    const params = filtros ? { ...filtros } : {};
    return this.http.get<Carga[]>(`${this.apiUrl}/cargas`, { params })
      .pipe(
        catchError(this.handleError<Carga[]>('getCargas', []))
      );
  }

  eliminarCarga(id: number): Observable<boolean> {
    return this.http.delete<any>(`${this.apiUrl}/cargas/${id}`)
      .pipe(
        map(() => true),
        catchError(this.handleError<boolean>('eliminarCarga', false))
      );
  }

  // === GENERACIÓN DE CÓDIGOS DE BARRAS ===

  generarCodigoBarrasLocalizacion(localizacion: Localizacion): string {
    // Implementación real usaría una librería como JsBarcode para generar el código
    return `${localizacion.etiquetaLocalizacion}${localizacion.sedeCP}${localizacion.plantaEdificio || ''}${localizacion.numeroIncremental}`;
  }

  // === GESTIÓN DE ERRORES ===

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      // Devuelve un resultado vacío para seguir la ejecución
      return of(result as T);
    };
  }
}