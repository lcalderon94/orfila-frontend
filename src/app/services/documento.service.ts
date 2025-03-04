import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TAREAS_COMPLETAS } from '../mock-data/tareas.mock';
import { DocumentoAsociado } from '../mock-data/tareas.mock';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
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
}