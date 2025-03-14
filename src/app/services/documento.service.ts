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

  get actualizaciones$(): Observable<void> {
    return this.documentosActualizados.asObservable();
  }

  notificarActualizacion(): void {
    this.documentosActualizados.next();
  }

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

  // Nuevos métodos para la implementación de botones
  
  descargarDocumento(id: string): Observable<Blob> {
    console.log(`Descargando documento: ${id}`);
    // Simular descarga de un PDF
    const pdfContent = 'Contenido del PDF simulado';
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return of(blob);
  }

  actualizarEstadoDocumento(nombreDocumento: string, nuevoEstado: string): void {
    let documentoActualizado = false;

    console.log(`Intentando actualizar documento "${nombreDocumento}" a estado "${nuevoEstado}"`);

    // Buscar en todas las tareas
    Object.values(TAREAS_COMPLETAS).forEach(tarea => {
      if (tarea.actuacion?.documentosAsociados) {
        tarea.actuacion.documentosAsociados.forEach(doc => {
          if (doc.nombre === nombreDocumento) {
            const estadoAnterior = doc.estado;
            doc.estado = nuevoEstado;
            documentoActualizado = true;
            console.log(`Documento actualizado en tarea: "${doc.nombre}" de estado "${estadoAnterior}" a "${nuevoEstado}"`);
          }
        });
      }
    });

    // Buscar en mapa de episodios
    Object.keys(EPISODIOS_DOCUMENTOS_MAP).forEach(key => {
      const docs = EPISODIOS_DOCUMENTOS_MAP[key];
      docs.forEach(doc => {
        if (doc.nombre === nombreDocumento) {
          const estadoAnterior = doc.estado;
          doc.estado = nuevoEstado;
          documentoActualizado = true;
          console.log(`Documento actualizado en episodio ${key}: "${doc.nombre}" de estado "${estadoAnterior}" a "${nuevoEstado}"`);
        }
      });
    });

    if (documentoActualizado) {
      console.log(`Documento "${nombreDocumento}" actualizado a estado "${nuevoEstado}"`);
      // Notificar a todos los componentes suscritos que hubo un cambio
      this.notificarActualizacion();
    } else {
      console.warn(`No se encontró ningún documento con nombre "${nombreDocumento}" para actualizar`);
    }
  }
  
  descargarMultiplesDocumentos(ids: string[]): Observable<Blob> {
    console.log(`Descargando múltiples documentos: ${ids.join(', ')}`);
    // Simular descarga de un ZIP con múltiples documentos
    const zipContent = 'Contenido del ZIP simulado';
    const blob = new Blob([zipContent], { type: 'application/zip' });
    return of(blob);
  }
  
  crearNuevaVersion(id: string): Observable<DocumentoAsociado> {
    console.log(`Creando nueva versión del documento: ${id}`);
    
    // Buscar el documento original
    let documentoOriginal: DocumentoAsociado | undefined;
    
    // Buscar en tareas
    for (const key in TAREAS_COMPLETAS) {
      const tarea = TAREAS_COMPLETAS[key];
      if (tarea.actuacion?.documentosAsociados) {
        const doc = tarea.actuacion.documentosAsociados.find(d => d.id === id);
        if (doc) {
          documentoOriginal = doc;
          break;
        }
      }
    }
    
    // Si no se encontró, buscar en episodios
    if (!documentoOriginal) {
      for (const key in EPISODIOS_DOCUMENTOS_MAP) {
        const doc = EPISODIOS_DOCUMENTOS_MAP[key].find(d => d.id === id);
        if (doc) {
          documentoOriginal = doc;
          break;
        }
      }
    }
    
    if (!documentoOriginal) {
      throw new Error(`No se encontró el documento original con ID: ${id}`);
    }
    
    // Crear nueva versión
    const nuevaVersion: DocumentoAsociado = {
      ...documentoOriginal,
      id: `${id}_v2`, // Simular incremento de versión
      fechaCreacion: new Date(),
      estado: 'En preparación',
    };
    
    // Añadir al episodio correspondiente si existe
    if (nuevaVersion.numEpisodio && EPISODIOS_DOCUMENTOS_MAP[nuevaVersion.numEpisodio]) {
      EPISODIOS_DOCUMENTOS_MAP[nuevaVersion.numEpisodio].push(nuevaVersion);
    }
    
    // Notificar actualización
    this.notificarActualizacion();
    
    return of(nuevaVersion);
  }
  
  eliminarDocumento(id: string): Observable<boolean> {
    console.log(`Eliminando documento: ${id}`);
    
    let eliminado = false;
    
    // Eliminar de tareas
    for (const key in TAREAS_COMPLETAS) {
      const tarea = TAREAS_COMPLETAS[key];
      if (tarea.actuacion?.documentosAsociados) {
        const index = tarea.actuacion.documentosAsociados.findIndex(d => d.id === id);
        if (index !== -1) {
          tarea.actuacion.documentosAsociados.splice(index, 1);
          eliminado = true;
          break;
        }
      }
    }
    
    // Eliminar de episodios
    if (!eliminado) {
      for (const key in EPISODIOS_DOCUMENTOS_MAP) {
        const index = EPISODIOS_DOCUMENTOS_MAP[key].findIndex(d => d.id === id);
        if (index !== -1) {
          EPISODIOS_DOCUMENTOS_MAP[key].splice(index, 1);
          eliminado = true;
          break;
        }
      }
    }
    
    // Notificar actualización
    this.notificarActualizacion();
    
    return of(eliminado);
  }
  
  obtenerDetalleDocumento(id: string): Observable<any> {
    console.log(`Obteniendo detalle del documento: ${id}`);
    
    // Simular detalle de documento
    return of({
      tamanio: '245 KB',
      firmantes: ['ARANDA RAMIREZ, CAROLINA', 'LÓPEZ GARCÍA, MANUEL'],
      historialCambios: [
        { fecha: new Date(), accion: 'Documento creado' },
        { fecha: new Date(Date.now() - 86400000), accion: 'Enviado a firma' }
      ]
    });
  }


  // Añade este método al DocumentoService

/**
 * Método para agregar un documento a un episodio específico
 * @param documento El documento a agregar
 * @param episodioId ID del episodio al que se asociará el documento
 */
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