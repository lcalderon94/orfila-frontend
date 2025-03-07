import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { TAREAS_COMPLETAS } from '../mock-data/tareas.mock';
import { DocumentoAsociado } from '../mock-data/tareas.mock';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private documentosActualizados = new Subject<void>();

  constructor() {}

  getDocumentos(): Observable<DocumentoAsociado[]> {
    // Recopilar todos los documentos de todas las tareas
    const todosDocumentos: DocumentoAsociado[] = [];
    Object.values(TAREAS_COMPLETAS).forEach(tarea => {
      if (tarea.actuacion?.documentosAsociados) {
        todosDocumentos.push(...tarea.actuacion.documentosAsociados);
      }
    });
    return of(todosDocumentos);
  }

  getDocumentosByTarea(numEpisodio: string): Observable<DocumentoAsociado[]> {
    const tareaCompleta = TAREAS_COMPLETAS[numEpisodio];
    if (tareaCompleta?.actuacion?.documentosAsociados) {
      return of(tareaCompleta.actuacion.documentosAsociados);
    }
    return of([]);
  }

  get actualizaciones$(): Observable<void> {
    return this.documentosActualizados.asObservable();
  }

  // Método modificado para aceptar un episodio específico
  agregarDocumento(documento: DocumentoAsociado, episodioId: string): void {
    console.log(`Agregando documento al episodio: ${episodioId}`);
    
    if (!episodioId) {
      console.error('No se ha proporcionado un ID de episodio válido');
      return;
    }
    
    // Asegurar que el documento tiene asignado el numEpisodio correcto
    documento.numEpisodio = episodioId;
    
    const tareaCompleta = TAREAS_COMPLETAS[episodioId];
    if (tareaCompleta && tareaCompleta.actuacion) {
      if (!tareaCompleta.actuacion.documentosAsociados) {
        tareaCompleta.actuacion.documentosAsociados = [];
      }
      
      tareaCompleta.actuacion.documentosAsociados.push(documento);
      this.documentosActualizados.next();
      
      console.log('Documento agregado correctamente al episodio:', episodioId);
    } else {
      console.error('No se encontró la tarea o la actuación para el episodio:', episodioId);
    }
  }

  
}