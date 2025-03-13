// portafirmas.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { DOCUMENTOS_FIRMA_MOCK, DocumentoFirma } from '../mock-data/portafirmas.mock';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PortafirmasService {
  // Estado interno de documentos
  private documentosPendientes: DocumentoFirma[] = [...DOCUMENTOS_FIRMA_MOCK];
  private documentosFirmados: DocumentoFirma[] = [];
  private documentosRechazados: DocumentoFirma[] = [];
  
  // Subjects para notificar cambios
  private documentosPendientesSubject = new BehaviorSubject<DocumentoFirma[]>(this.documentosPendientes);
  private documentosFirmadosSubject = new BehaviorSubject<DocumentoFirma[]>(this.documentosFirmados);
  private documentosRechazadosSubject = new BehaviorSubject<DocumentoFirma[]>(this.documentosRechazados);
  
  // Observables públicos
  public documentosPendientes$ = this.documentosPendientesSubject.asObservable();
  public documentosFirmados$ = this.documentosFirmadosSubject.asObservable();
  public documentosRechazados$ = this.documentosRechazadosSubject.asObservable();
  
  constructor(private snackBar: MatSnackBar) {
    this.actualizarDocumentos();
  }
  
  private actualizarDocumentos(): void {
    this.documentosPendientesSubject.next([...this.documentosPendientes]);
    this.documentosFirmadosSubject.next([...this.documentosFirmados]);
    this.documentosRechazadosSubject.next([...this.documentosRechazados]);
  }
  
  getDocumentosPendientes(): Observable<DocumentoFirma[]> {
    return of([...this.documentosPendientes]).pipe(delay(300));
  }

  getDocumentosTramitador(): Observable<DocumentoFirma[]> {
    // Simular documentos en tramitación
    const documentosTramitador = [...this.documentosPendientes].map(doc => ({
      ...doc,
      estado: ['Pendiente de firma', 'En proceso', 'Firmado', 'Rechazado'][Math.floor(Math.random() * 4)]
    }));
    
    return of(documentosTramitador).pipe(delay(500));
  }

  getDocumentosValidar(): Observable<DocumentoFirma[]> {
    // Crear una copia superficial de los documentos pendientes para no modificar los originales
    const copiaDocumentos = [...this.documentosPendientes];
    
    // Filtrar solo los que ya están marcados como pendientes de validación
    let documentosParaValidar = copiaDocumentos.filter(doc => 
      doc.estado === 'Pendiente de validación'
    );
    
    // Si hay menos de 3 documentos para validar, añadimos algunos más (máximo 3 en total)
    // PERO SOLO EN LA COPIA, no modificamos los originales
    if (documentosParaValidar.length < 3) {
      // Documentos no marcados para validación y que no estén en el histórico
      const candidatos = copiaDocumentos
        .filter(doc => doc.estado !== 'Pendiente de validación');
      
      // Tomar solo los necesarios para completar 3 (o menos si no hay suficientes)
      const adicionales = candidatos.slice(0, 3 - documentosParaValidar.length);
      
      // Crear copias temporales con estado modificado (no afecta a los originales)
      const documentosTemporales = adicionales.map(doc => ({
        ...doc,
        estado: 'Pendiente de validación'
      }));
      
      // Añadir los documentos temporales a la lista
      documentosParaValidar = [...documentosParaValidar, ...documentosTemporales];
    }
    
    return of(documentosParaValidar).pipe(delay(300));
  }
  
  getDocumentosHistorico(): Observable<DocumentoFirma[]> {
    // Combinamos firmados y rechazados para el histórico
    const historico = [...this.documentosFirmados, ...this.documentosRechazados];
    
    // Ordenamos por fecha descendente (más recientes primero)
    historico.sort((a, b) => {
      return new Date(b.fechaAlta).getTime() - new Date(a.fechaAlta).getTime();
    });
    
    return of(historico).pipe(delay(300));
  }
  
firmarDocumentos(ids: string[]): Observable<boolean> {
  const documentosFirmados: DocumentoFirma[] = [];
  
  ids.forEach(id => {
    const index = this.documentosPendientes.findIndex(doc => doc.id === id);
    if (index !== -1) {
      // Obtener el documento y cambiar su estado
      const documento = {...this.documentosPendientes[index]};
      documento.estado = 'Firmado';
      
      // Actualizar el progreso - si era 0/1 pasa a 1/1, si era 0/2 pasa a 2/2
      const partes = documento.progreso.split('/');
      if (partes.length === 2) {
        const totalFirmas = parseInt(partes[1]);
        documento.progreso = `${totalFirmas}/${totalFirmas}`;
      }
      
      // Guardar en firmados y eliminar de pendientes
      documentosFirmados.push(documento);
      this.documentosPendientes.splice(index, 1);
    }
  });
  
  // Añadir todos los documentos firmados a la lista
  this.documentosFirmados.push(...documentosFirmados);
  
  // Actualizar los observables
  this.actualizarDocumentos();
  
  // Notificaciones
  this.snackBar.open(`${ids.length} documentos firmados correctamente`, 'Cerrar', {
    duration: 3000
  });
  
  setTimeout(() => {
    this.snackBar.open('Actualice la página de Orfila para ver los cambios (F5)', 'Cerrar', {
      duration: 5000
    });
  }, 3100);
  
  return of(true).pipe(delay(500));
}
  
  rechazarDocumentos(ids: string[], motivo: string): Observable<boolean> {
    const documentosRechazados: DocumentoFirma[] = [];
    
    ids.forEach(id => {
      const index = this.documentosPendientes.findIndex(doc => doc.id === id);
      if (index !== -1) {
        // Obtener el documento y cambiar su estado
        const documento = {...this.documentosPendientes[index]};
        documento.estado = 'Rechazado';
        documento.motivoRechazo = motivo;
        
        // Guardar en rechazados y eliminar de pendientes
        documentosRechazados.push(documento);
        this.documentosPendientes.splice(index, 1);
      }
    });
    
    // Añadir todos los documentos rechazados a la lista
    this.documentosRechazados.push(...documentosRechazados);
    
    // Actualizar los observables
    this.actualizarDocumentos();
    
    // Notificaciones
    this.snackBar.open(`${ids.length} documentos rechazados`, 'Cerrar', {
      duration: 3000
    });
    
    setTimeout(() => {
      this.snackBar.open('Actualice la página de Orfila para ver los cambios (F5)', 'Cerrar', {
        duration: 5000
      });
    }, 3100);
    
    return of(true).pipe(delay(500));
  }
  
  descargarDocumento(id: string): Observable<boolean> {
    // Buscar en todas las listas
    let documento = this.documentosPendientes.find(doc => doc.id === id) ||
                   this.documentosFirmados.find(doc => doc.id === id) ||
                   this.documentosRechazados.find(doc => doc.id === id);
    
    if (documento) {
      this.snackBar.open(`Descargando documento: ${documento.titulo}`, 'Cerrar', {
        duration: 3000
      });
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }
  
  mostrarDetalleDocumento(id: string): DocumentoFirma | null {
    // Buscar en todas las listas
    return this.documentosPendientes.find(doc => doc.id === id) ||
           this.documentosFirmados.find(doc => doc.id === id) ||
           this.documentosRechazados.find(doc => doc.id === id) ||
           null;
  }

  reasignarFirmantes(documentoId: string, dnisFirmantes: string[]): Observable<boolean> {
    // Simular operación
    return of(true).pipe(
      delay(800),
      tap(() => {
        console.log(`Reasignados firmantes para documento ${documentoId}: ${dnisFirmantes.join(', ')}`);
        
        // Buscar el documento original
        const documento = this.documentosPendientes.find(doc => doc.id === documentoId);
        if (documento) {
          // Crear una copia para el histórico (mantenemos registro del cambio)
          const docHistorico = {...documento, estado: 'Firmantes reasignados'};
          this.documentosFirmados.push(docHistorico);
          
          // Actualizar el documento en documentosPendientes
          const index = this.documentosPendientes.findIndex(doc => doc.id === documentoId);
          if (index !== -1) {
            // Actualizar el documento existente con nuevos firmantes
            this.documentosPendientes[index] = {
              ...documento,
              progreso: '0/' + dnisFirmantes.length, // Actualizar progreso para reflejar número de firmantes
              fechaAlta: new Date() // Actualizar fecha para reflejar el cambio
            };
          }
          
          // Actualizar observables
          this.actualizarDocumentos();
        }
      })
    );
  }
  
  // Anular flujos
  anularFlujos(documentosIds: string[]): Observable<boolean> {
    // Simular operación
    return of(true).pipe(
      delay(800),
      tap(() => {
        console.log(`Flujos anulados: ${documentosIds.join(', ')}`);
        
        // Mover documentos al histórico
        documentosIds.forEach(id => {
          const documento = this.documentosPendientes.find(doc => doc.id === id);
          if (documento) {
            const docHistorico = {...documento, estado: 'Flujo anulado'};
            this.documentosPendientes = this.documentosPendientes.filter(doc => doc.id !== id);
            this.documentosRechazados.push(docHistorico);
          }
        });
      })
    );
  }
  
  // Modificar flujo de firma
  modificarFlujo(documentoId: string, flujo: any): Observable<boolean> {
    // Simular operación
    return of(true).pipe(
      delay(800),
      tap(() => {
        console.log(`Modificado flujo para documento ${documentoId}`);
        
        // Mover documento al histórico
        const documento = this.documentosPendientes.find(doc => doc.id === documentoId);
        if (documento) {
          const docHistorico = {...documento, estado: 'Flujo modificado'};
          this.documentosPendientes = this.documentosPendientes.filter(doc => doc.id !== documentoId);
          this.documentosFirmados.push(docHistorico);
        }
      })
    );
  }
  
  // Crear nuevo flujo
  crearNuevoFlujo(flujo: any): Observable<boolean> {
    return of(true).pipe(
      delay(800),
      tap(() => {
        console.log('Creado nuevo flujo:', flujo);
        
        // Crear nuevo documento y añadirlo a documentos pendientes
        const nuevoDocumento: DocumentoFirma = {
          id: 'nuevo_' + Date.now(),
          aplicacion: 'IMLZ',
          titulo: flujo.titulo,
          tramitador: 'ARANDA RAMIREZ, CAROLINA',
          estado: 'Pendiente de firma', // Cambiado estado
          progreso: '0/1',
          fechaAlta: new Date()
        };
        
        // Añadir a documentos pendientes en lugar de al histórico
        this.documentosPendientes.push(nuevoDocumento);
        
        // Actualizar observables
        this.actualizarDocumentos();
      })
    );
  }
  
  // Obtener firmantes de un documento
  getFirmantes(documentoId: string): Observable<any[]> {
    // Simular datos
    return of([
      { nombre: 'ARANDA RAMIREZ, CAROLINA', dni: '12345678A', estado: 'Firmado', fecha: new Date() },
      { nombre: 'LÓPEZ GARCÍA, MANUEL', dni: '87654321B', estado: 'Pendiente', fecha: null }
    ]).pipe(delay(300));
  }
  
  // Obtener historial de flujo
  getHistorialFlujo(documentoId: string): Observable<any[]> {
    // Simular datos
    return of([
      { accion: 'Creación del flujo', usuario: 'GARCÍA PÉREZ, ANA', fecha: new Date(Date.now() - 86400000 * 5) },
      { accion: 'Firma', usuario: 'ARANDA RAMIREZ, CAROLINA', fecha: new Date(Date.now() - 86400000) },
      { accion: 'Modificación del flujo', usuario: 'GARCÍA PÉREZ, ANA', fecha: new Date() }
    ]).pipe(delay(300));
  }
  
  // Validar documentos
  validarDocumentos(documentosIds: string[]): Observable<boolean> {
    return of(true).pipe(
      delay(800),
      tap(() => {
        console.log(`Documentos validados: ${documentosIds.join(', ')}`);
        
        // Mover documentos al histórico
        documentosIds.forEach(id => {
          const documento = this.documentosPendientes.find(doc => doc.id === id);
          if (documento) {
            const docHistorico = {...documento, estado: 'Validado'};
            this.documentosPendientes = this.documentosPendientes.filter(doc => doc.id !== id);
            this.documentosFirmados.push(docHistorico);
          }
        });
        
        // AÑADIR ESTA LÍNEA para actualizar los observables
        this.actualizarDocumentos();
      })
    );
  }
  
  // Rechazar validación
  rechazarValidacion(documentosIds: string[], motivo: string): Observable<boolean> {
    return of(true).pipe(
      delay(800),
      tap(() => {
        console.log(`Validación rechazada para documentos: ${documentosIds.join(', ')}. Motivo: ${motivo}`);
        
        // Mover documentos al histórico
        documentosIds.forEach(id => {
          const documento = this.documentosPendientes.find(doc => doc.id === id);
          if (documento) {
            const docHistorico = {
              ...documento, 
              estado: 'Validación rechazada',
              motivoRechazo: motivo
            };
            this.documentosPendientes = this.documentosPendientes.filter(doc => doc.id !== id);
            this.documentosRechazados.push(docHistorico);
          }
        });
        
        // IMPORTANTE: Actualizar observables para que los cambios se reflejen
        this.actualizarDocumentos();
      })
    );
  }
}