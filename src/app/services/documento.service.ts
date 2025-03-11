import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { TAREAS_COMPLETAS } from '../mock-data/tareas.mock';
import { DocumentoAsociado } from '../mock-data/tareas.mock';
import { EPISODIOS_DOCUMENTOS_MAP } from '../mock-data/episodios-documentos.mock';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private documentosActualizados = new Subject<void>();

  constructor() {}

  getDocumentos(): Observable<DocumentoAsociado[]> {
    const todosDocumentos: DocumentoAsociado[] = [];
    
    // Añadir documentos de tareas
    Object.values(TAREAS_COMPLETAS).forEach(tarea => {
      if (tarea.actuacion?.documentosAsociados) {
        todosDocumentos.push(...tarea.actuacion.documentosAsociados);
      }
    });
    
    // Añadir documentos directamente asociados a episodios
    Object.values(EPISODIOS_DOCUMENTOS_MAP).forEach(docs => {
      // Filtrar duplicados
      const idsExistentes = new Set(todosDocumentos.map(d => d.id));
      docs.forEach(doc => {
        if (!idsExistentes.has(doc.id)) {
          todosDocumentos.push(doc);
        }
      });
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

  getDocumentosByEpisodio(episodioId: string): Observable<DocumentoAsociado[]> {
    console.log(`Buscando documentos para episodio: ${episodioId}`);
    const documentos: DocumentoAsociado[] = [];
    
    // Normalizar ID
    const idNormalizado = episodioId.startsWith('EP') ? episodioId : 'EP' + episodioId;
    const idSinPrefijo = idNormalizado.replace('EP', '');
    
    // 1. Buscar documentos directamente asociados al episodio
    if (EPISODIOS_DOCUMENTOS_MAP[idNormalizado]) {
      console.log(`Encontrados ${EPISODIOS_DOCUMENTOS_MAP[idNormalizado].length} documentos en EPISODIOS_DOCUMENTOS_MAP[${idNormalizado}]`);
      documentos.push(...EPISODIOS_DOCUMENTOS_MAP[idNormalizado]);
    } else {
      console.log(`No se encontraron documentos en EPISODIOS_DOCUMENTOS_MAP[${idNormalizado}]`);
    }
    
    // 2. Buscar documentos asociados a través de tareas (si existen)
    if (TAREAS_COMPLETAS[idSinPrefijo]?.actuacion?.documentosAsociados) {
      // Usar el operador de afirmación no nulo (!) para indicar a TypeScript que este valor nunca será undefined
      const docsActuacion = TAREAS_COMPLETAS[idSinPrefijo].actuacion.documentosAsociados!;
      console.log(`Encontrados ${docsActuacion.length} documentos en TAREAS_COMPLETAS[${idSinPrefijo}]`);
      
      // Filtrar para no añadir duplicados
      const idsExistentes = new Set(documentos.map(d => d.id));
      
      docsActuacion.forEach(doc => {
        if (!idsExistentes.has(doc.id)) {
          documentos.push(doc);
          idsExistentes.add(doc.id);
        }
      });
    } else {
      console.log(`No se encontró tarea para el episodio ${idSinPrefijo} o no tiene documentos asociados`);
    }
    
    console.log(`Total de documentos encontrados: ${documentos.length}`);
    return of(documentos);
  }

  
}