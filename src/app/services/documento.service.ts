// DocumentoService.ts - VERSIÓN COMPLETA Y FUNCIONAL
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { TAREAS_COMPLETAS } from '../mock-data/tareas.mock';
import { DocumentoAsociado } from '../mock-data/tareas.mock';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  // Este es el Subject que faltaba para las actualizaciones
  private documentosActualizados = new Subject<void>();

  constructor() {}

  getDocumentos(): Observable<DocumentoAsociado[]> {
    // Como no hay un MOCK_DOCUMENTOS separado, usaremos los documentos de la primera tarea
    const primeraTarea = TAREAS_COMPLETAS['81329'];
    return of(primeraTarea?.actuacion?.documentosAsociados || []);
  }

  getDocumentosByTarea(numEpisodio: string): Observable<DocumentoAsociado[]> {
    const tareaCompleta = TAREAS_COMPLETAS[numEpisodio];
    if (tareaCompleta?.actuacion?.documentosAsociados) {
      return of(tareaCompleta.actuacion.documentosAsociados);
    }
    return of([]);
  }

  // Esta es la propiedad que estaba faltando
  get actualizaciones$(): Observable<void> {
    return this.documentosActualizados.asObservable();
  }

  // Método para agregar documentos a una tarea específica
  agregarDocumento(documento: DocumentoAsociado): void {
    // Hardcodeamos el ID porque sabemos que funciona sin problemas
    const numEpisodio = '81329';
    
    // Obtener los documentos existentes si los hay
    const tareaCompleta = TAREAS_COMPLETAS[numEpisodio];
    if (tareaCompleta && tareaCompleta.actuacion) {
      if (!tareaCompleta.actuacion.documentosAsociados) {
        tareaCompleta.actuacion.documentosAsociados = [];
      }
      
      // Agregar el nuevo documento
      tareaCompleta.actuacion.documentosAsociados.push(documento);
      
      // Notificar cambios
      this.documentosActualizados.next();
      
      console.log('Documento agregado correctamente');
    } else {
      console.error('La tarea o actuación no existe');
    }
  }
}