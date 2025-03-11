// lexnet.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, delay } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EpisodiosService } from './episodio.service';
import { MOCK_DOCUMENTOS } from '../mock-data/documentos.mock';
import { Documento } from '../mock-data/documentos.mock';
import { first } from 'rxjs/operators';
import { EPISODIOS_DOCUMENTOS_MAP } from '../mock-data/episodios-documentos.mock';
import { DocumentoAsociado, TAREAS_COMPLETAS } from '../mock-data/tareas.mock';
import { Subject } from 'rxjs';


// Interfaces
export interface MensajeRecibido {
  id: string;
  leido: boolean;
  nMensaje: string;
  tipoMensaje: string;
  remitente: string;
  asunto: string;
  nAnio: string;
  tipoProc: string;
  fechaNotificacion: Date;
}

export interface DetalleNotificacion {
  tipoMensaje: string;
  remitente: string;
  asunto: string;
  nAnio: string;
  tipoProcedimiento: string;
  fechaNotificacion: Date;
  nig?: string;
  documentos: DocumentoLexnet[];
}

export interface DocumentoLexnet {
  id: string;
  nombre: string;
  descripcion: string;
  principal: boolean;
  url?: string;
}

export interface EstadoEnvio {
  id: string;
  fEnvio: string;
  nEnvio: string;
  episodio: string;
  tipoProcedimiento: string;
  nAnio: string;
  tipoDocPrincipal: string;
  usuario: string;
  estado: string;
}

export interface DetalleEnvio {
  id: string;
  fEnvio: string;
  nEnvio: string;
  episodio: string;
  tipoProcedimiento: string;
  nAnio: string;
  tipoDocPrincipal: string;
  usuario: string;
  estado: string;
  descripcion: string;
  tipoDocumento: string;
  subtipoDocumento: string;
  urgente: boolean;
  observaciones: string;
  documentos: DocumentoLexnet[];
}

export interface EnvioLexnet {
  episodioId: string;
  descripcion: string;
  tipoDocumento: string;
  subtipoDocumento: string;
  urgente: boolean;
  observaciones: string;
  documentoPrincipal: string;
  documentosAdjuntos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LexnetService {

  private documentosActualizados = new Subject<void>();
  
  get actualizaciones$() {
    return this.documentosActualizados.asObservable();
  }
  
  // Mock data - En un entorno real, esto vendría del backend
  private mockMensajes: MensajeRecibido[] = [
    {
      id: '1',
      leido: false,
      nMensaje: '123456',
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de Instrucción N° 5 de Madrid',
      asunto: 'Diligencias previas 842/2023',
      nAnio: '842',
      tipoProc: 'Diligencias Previas',
      fechaNotificacion: new Date('2023-09-03')
    },
    {
      id: '2',
      leido: true,
      nMensaje: '123457',
      tipoMensaje: 'Escrito',
      remitente: 'INTCF',
      asunto: 'Informe toxicológico 456/2022',
      nAnio: '842',
      tipoProc: 'Diligencias Previas',
      fechaNotificacion: new Date('2022-08-02')
    }
  ];

  private mockEstadosEnvio: EstadoEnvio[] = [
    {
      id: '1',
      fEnvio: '01/08/2022',
      nEnvio: 'ENV123456',
      episodio: 'EP202200001',
      tipoProcedimiento: 'Diligencias previas',
      nAnio: '123/2022',
      tipoDocPrincipal: 'Informe',
      usuario: '12345678A',
      estado: 'Enviado'
    },
    {
      id: '2',
      fEnvio: '02/08/2022',
      nEnvio: 'ENV123457',
      episodio: 'EP202200002',
      tipoProcedimiento: 'Diligencias previas',
      nAnio: '456/2022',
      tipoDocPrincipal: 'Informe',
      usuario: '12345678A',
      estado: 'Aceptado'
    }
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private episodiosService: EpisodiosService
  ) { }

  // Métodos para Mensajes Recibidos
  getMensajesRecibidos(filtros?: any): Observable<MensajeRecibido[]> {
    // Simular filtros
    let mensajesFiltrados = [...this.mockMensajes];
    
    if (filtros) {
      if (filtros.estado === 'leido') {
        mensajesFiltrados = mensajesFiltrados.filter(m => m.leido);
      } else if (filtros.estado === 'noLeido') {
        mensajesFiltrados = mensajesFiltrados.filter(m => !m.leido);
      }
      
      // Filtrar por fechas
      if (filtros.fechaConsultaDesde) {
        const fechaDesde = new Date(filtros.fechaConsultaDesde);
        mensajesFiltrados = mensajesFiltrados.filter(m => 
          m.fechaNotificacion >= fechaDesde
        );
      }
      
      if (filtros.fechaConsultaHasta) {
        const fechaHasta = new Date(filtros.fechaConsultaHasta);
        mensajesFiltrados = mensajesFiltrados.filter(m => 
          m.fechaNotificacion <= fechaHasta
        );
      }
    }
    
    return of(mensajesFiltrados);
  }

  getDetalleNotificacion(id: string): Observable<DetalleNotificacion> {
    // Simulamos la respuesta
    return of({
      tipoMensaje: 'Notificación',
      remitente: 'Jdo. de Instrucción N° 5 de Madrid',
      asunto: 'Diligencias previas 842/2023',
      nAnio: '842',
      tipoProcedimiento: 'Diligencias Previas',
      fechaNotificacion: new Date('2023-09-03'),
      nig: '28079000000000000',
      documentos: [
        {
          id: '1',
          nombre: 'Auto_842_2023.pdf',
          descripcion: 'Auto de diligencias previas',
          principal: true
        },
        {
          id: '2',
          nombre: 'Pericial_842_2023.pdf',
          descripcion: 'Solicitud de informe pericial',
          principal: false
        }
      ]
    });
  }

  getDetalleEscrito(id: string): Observable<DetalleNotificacion> {
    // Simulamos la respuesta
    return of({
      tipoMensaje: 'Escrito',
      remitente: 'INTCF',
      asunto: 'Informe toxicológico 456/2022',
      nAnio: '842',
      tipoProcedimiento: 'Diligencias Previas',
      fechaNotificacion: new Date('2022-08-02'),
      nig: '28079000000000001',
      documentos: [
        {
          id: '1',
          nombre: 'InformeToxicologico_456_2022.pdf',
          descripcion: 'Informe toxicológico',
          principal: true
        },
        {
          id: '2',
          nombre: 'AnexoI_456_2022.pdf',
          descripcion: 'Anexo I - Resultados analíticos',
          principal: false
        }
      ]
    });
  }

  marcarComoLeido(mensajeId: string): Observable<boolean> {
    // Encontrar el mensaje y marcarlo como leído
    const mensaje = this.mockMensajes.find(m => m.id === mensajeId);
    if (mensaje) {
      mensaje.leido = true;
      return of(true);
    }
    return of(false);
  }

  marcarComoNoLeido(mensajeId: string): Observable<boolean> {
    // Encontrar el mensaje y marcarlo como no leído
    const mensaje = this.mockMensajes.find(m => m.id === mensajeId);
    if (mensaje) {
      mensaje.leido = false;
      return of(true);
    }
    return of(false);
  }

  // Métodos para Estado de Envíos
  getEstadosEnvios(filtros?: any): Observable<EstadoEnvio[]> {
    return of(this.mockEstadosEnvio);
  }

  getDetalleEnvio(id: string): Observable<DetalleEnvio> {
    // Simulamos la respuesta
    return of({
      id: '1',
      fEnvio: '01/08/2022',
      nEnvio: 'ENV123456',
      episodio: 'EP202200001',
      tipoProcedimiento: 'Diligencias previas',
      nAnio: '123/2022',
      tipoDocPrincipal: 'Informe',
      usuario: '12345678A',
      estado: 'Enviado',
      descripcion: 'Informe pericial', 
      tipoDocumento: 'INFORME',
      subtipoDocumento: 'INFORME',
      urgente: false,
      observaciones: '',
      documentos: [
        {
          id: '1',
          nombre: 'InformePericial_123_2022.pdf',
          descripcion: 'Informe pericial',
          principal: true
        },
        {
          id: '2',
          nombre: 'Anexo_123_2022.pdf',
          descripcion: 'Anexo del informe',
          principal: false
        }
      ]
    });
  }

  getAcuseRecibo(id: string): Observable<any> {
    // Simulamos la respuesta
    return of({
      nEnvio: 'ENV123456',
      fechaEnvio: '01/08/2022',
      estado: 'Aceptado',
      fechaAcuse: '02/08/2022',
      codigoAcuse: 'ACU123456',
      organoDestino: 'Juzgado Primera Instancia Nº 3',
      contenido: 'Acuse de recibo del envío ENV123456 realizado con éxito.'
    });
  }

  actualizarEstadoMensajes(): Observable<boolean> {
    this.snackBar.open('Estados actualizados correctamente', 'Cerrar', {
      duration: 3000
    });
    return of(true);
  }

  // Métodos para Envío a LexNET
  enviarALexnet(envio: EnvioLexnet): Observable<any> {
    this.snackBar.open('Documentos enviados correctamente a LexNET', 'Cerrar', {
      duration: 3000
    });
    
    // Agregar el envío a los mockEstadosEnvio
    const nuevoEnvio: EstadoEnvio = {
      id: (this.mockEstadosEnvio.length + 1).toString(),
      fEnvio: new Date().toLocaleDateString(),
      nEnvio: 'ENV' + Math.floor(Math.random() * 1000000),
      episodio: envio.episodioId,
      tipoProcedimiento: 'Diligencias Previas', // Esto debería venir del episodio
      nAnio: '456', // Esto debería venir del episodio
      tipoDocPrincipal: envio.tipoDocumento,
      usuario: '12345678A', // Debería ser el usuario actual
      estado: 'Enviado'
    };
    
    this.mockEstadosEnvio.push(nuevoEnvio);
    
    return of({
      resultado: 'OK',
      mensaje: 'Envío realizado correctamente',
      codigoEnvio: nuevoEnvio.nEnvio
    });
  }

  // Métodos auxiliares
  verificarExisteEpisodio(remitente: string, tipoProcedimiento: string, nAnio: string, tipoMensaje?: string): Observable<{existe: boolean, episodioId?: string}> {
    return this.episodiosService.getEpisodios().pipe(
      map(episodios => {
        const esEscrito = tipoMensaje === 'Escrito';
        
        // Función de normalización de textos
        const normalizar = (texto: string): string => {
          return texto.trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
            .replace(/[Nn][°º\u00BA\u00B0\u2116]/g, "N") // Normalizar Nº, N°, etc.
            .toLowerCase();
        };
        
        const episodioEncontrado = episodios.find(ep => {
          // Normalizar todos los valores antes de comparar
          const coincideTipo = normalizar(ep.tipoProcedimiento) === normalizar(tipoProcedimiento);
          const coincideAnio = normalizar(ep.nAnio) === normalizar(nAnio);
          const coincideRemitente = esEscrito || 
                                 normalizar(ep.organismo) === normalizar(remitente) || 
                                 normalizar(ep.organoAseguradora) === normalizar(remitente);
          
          return coincideTipo && coincideAnio && coincideRemitente;
        });
        
        return {
          existe: !!episodioEncontrado,
          episodioId: episodioEncontrado?.nEpisodio
        };
      })
    );
  }

  getDocumentosDisponiblesEpisodio(episodioId: string): Observable<DocumentoLexnet[]> {
    // Simulamos la respuesta
    return of([
      {
        id: '1',
        nombre: 'InformePericial_123_2022.pdf',
        descripcion: 'Informe pericial',
        principal: false
      },
      {
        id: '2',
        nombre: 'Anexo_123_2022.pdf',
        descripcion: 'Anexo del informe',
        principal: false
      },
      {
        id: '3',
        nombre: 'InformeToxicologico_123_2022.pdf',
        descripcion: 'Informe toxicológico',
        principal: false
      }
    ]);
  }

  /**
 * Asocia un documento de LexNET (notificación o escrito) a un episodio
 */
  asociarDocumentoAEpisodio(documentoId: string, episodioId: string): Observable<boolean> {
    console.log(`Asociando documento ${documentoId} al episodio ${episodioId}`);
    
    // Normalizar ID (añadir prefijo EP si no lo tiene)
    const idNormalizado = episodioId.startsWith('EP') ? episodioId : 'EP' + episodioId;
    const idSinPrefijo = idNormalizado.substring(2); // quitar "EP" para buscar en TAREAS_COMPLETAS
    
    // Crear objeto documento
    const documento: DocumentoAsociado = {
      id: documentoId,
      nombre: `Documento LexNET ${documentoId}`,
      tipo: 'Documento LexNET',
      estado: 'Firmado',
      fechaCreacion: new Date(),
      autor: 'Sistema',
      numEpisodio: idSinPrefijo
    };
    
    // Asociar al mapa de episodios-documentos
    if (!EPISODIOS_DOCUMENTOS_MAP[idNormalizado]) {
      console.log(`Creando entrada para episodio ${idNormalizado} en EPISODIOS_DOCUMENTOS_MAP`);
      EPISODIOS_DOCUMENTOS_MAP[idNormalizado] = [];
    }
    
    console.log(`Añadiendo documento a EPISODIOS_DOCUMENTOS_MAP[${idNormalizado}]`);
    EPISODIOS_DOCUMENTOS_MAP[idNormalizado].push(documento);
    
    // También asociar a la tarea si existe
    if (TAREAS_COMPLETAS[idSinPrefijo]?.actuacion) {
      console.log(`Episodio encontrado en TAREAS_COMPLETAS: ${idSinPrefijo}`);
      if (!TAREAS_COMPLETAS[idSinPrefijo].actuacion.documentosAsociados) {
        TAREAS_COMPLETAS[idSinPrefijo].actuacion.documentosAsociados = [];
      }
      console.log(`Añadiendo documento a TAREAS_COMPLETAS[${idSinPrefijo}].actuacion.documentosAsociados`);
      // Usar el operador de afirmación no nulo
      TAREAS_COMPLETAS[idSinPrefijo].actuacion.documentosAsociados!.push(documento);
    } else {
      console.log(`Episodio NO encontrado en TAREAS_COMPLETAS: ${idSinPrefijo}`);
    }
    
    // Notificar que los documentos han sido actualizados
    this.documentosActualizados.next();
    console.log('Notificación de actualización enviada');
    
    return of(true);
  }

  /**
 * Asocia múltiples documentos de LexNET a un episodio
 */
  asociarMultiplesDocumentosAEpisodio(documentosIds: string[], episodioId: string): Observable<boolean> {
    console.log(`Asociando ${documentosIds.length} documentos al episodio ${episodioId}`);
    
    // Procesar cada documento
    documentosIds.forEach(docId => {
      this.asociarDocumentoAEpisodio(docId, episodioId).subscribe();
    });
    
    return of(true);
  }

/**
 * Obtiene un documento de LexNET a partir de su ID
 * (Implementación simplificada - en producción buscaría en notificaciones y escritos)
 */
private obtenerDocumentoLexnet(documentoId: string): DocumentoLexnet | null {
  // Buscar en todas las notificaciones y escritos
  for (const mensaje of this.mockMensajes) {
    let documento: DocumentoLexnet | null = null;

    if (mensaje.tipoMensaje === 'Notificación') {
      this.getDetalleNotificacion(mensaje.id).pipe(
        first()
      ).subscribe(notif => {
        const doc = notif.documentos.find(d => d.id === documentoId);
        if (doc) documento = doc;
      });
      if (documento) return documento;
    } else if (mensaje.tipoMensaje === 'Escrito') {
      this.getDetalleEscrito(mensaje.id).pipe(
        first()
      ).subscribe(esc => {
        const doc = esc.documentos.find(d => d.id === documentoId);
        if (doc) documento = doc;
      });
      if (documento) return documento;
    }
  }
  
  return null;
}

/**
 * Extrae el número/año del nombre del documento
 */
private extraerNumAnio(nombreDocumento: string): string {
  // Implementación simplificada - en producción podría usar expresiones regulares
  // para extraer el formato correcto de N°/Año del nombre del documento
  const match = nombreDocumento.match(/(\d+)\/(\d{4})/);
  return match ? match[0] : '';
}

  
}