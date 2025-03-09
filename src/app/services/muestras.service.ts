import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Localizacion {
  id?: number;
  tipoLocalizacion: string; // 'local' o 'externa'
  etiquetaLocalizacion: string; // LI o LE
  sedeCP: string;
  plantaEdificio?: string; // Solo para localizaciones locales
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
  esUltimoMovimiento?: boolean;
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
  private muestrasCache: Map<string, Muestra[]> = new Map();

  
  // Lista mock de localizaciones que simula persistencia en memoria
  private localizacionesMock: Localizacion[] = [
    {
      id: 1,
      tipoLocalizacion: 'local',
      etiquetaLocalizacion: 'LI',
      sedeCP: '28043',
      plantaEdificio: '000',
      numeroIncremental: '0001',
      descripcionLocalizacion: 'Congelador planta baja - Laboratorio principal',
      codigoBarras: 'LI280430000001',
      tieneMuestras: true,
      porDefecto: false
    },
    {
      id: 2,
      tipoLocalizacion: 'local',
      etiquetaLocalizacion: 'LI',
      sedeCP: '28043',
      plantaEdificio: '001',
      numeroIncremental: '0002',
      descripcionLocalizacion: 'Nevera primera planta - Sala de autopsias',
      codigoBarras: 'LI280430010002',
      tieneMuestras: false,
      porDefecto: true
    },
    {
      id: 3,
      tipoLocalizacion: 'externa',
      etiquetaLocalizacion: 'LE',
      sedeCP: '28014',
      numeroIncremental: '0001',
      descripcionLocalizacion: 'Instituto Nacional de Toxicología y Ciencias Forenses',
      codigoBarras: 'LE280140001',
      tieneMuestras: true,
      porDefecto: false
    },
    {
      id: 4,
      tipoLocalizacion: 'externa',
      etiquetaLocalizacion: 'LE',
      sedeCP: '28008',
      numeroIncremental: '0002',
      descripcionLocalizacion: 'Hospital Clínico - Departamento de Anatomía Patológica',
      codigoBarras: 'LE280080002',
      tieneMuestras: false,
      porDefecto: false
    }
  ];
  
  // Lista mock de muestras
  private muestrasMock: Muestra[] = [
    {
      id: 1,
      codigoBarras: 'M20230001',
      fechaRegistro: new Date('2023-01-15T10:30:00'),
      usuario: 'Usuario Ejemplo',
      localizacion: this.deepClone(this.localizacionesMock[0]),
      descripcion: 'Muestra de sangre',
      episodioId: 123,
      episodioNumero: 'EP123/2023',
      sujetoId: 456,
      sujetoNombre: 'Sujeto Ejemplo',
      esUltimoMovimiento: true
    },
    {
      id: 2,
      codigoBarras: 'M20230002',
      fechaRegistro: new Date('2023-01-20T11:45:00'),
      usuario: 'Usuario Ejemplo',
      localizacion: this.deepClone(this.localizacionesMock[2]),
      descripcion: 'Muestra de tejido',
      episodioId: 124,
      episodioNumero: 'EP124/2023',
      sujetoId: 457,
      sujetoNombre: 'Sujeto Ejemplo 2',
      esUltimoMovimiento: true
    }
  ];
  
  // Lista mock de cargas
  private cargasMock: Carga[] = [
    {
      id: 20230001,
      fechaCarga: new Date('2023-01-10T09:00:00'),
      numeroDeMuestras: 5,
      usuarioCarga: 'Usuario Ejemplo',
      procesada: true,
      registros: [
        {
          codigoBarrasLocalizacion: 'LI280430000001',
          descripcionLocalizacion: 'Congelador planta baja - Laboratorio principal',
          fechaRegistro: new Date('2023-01-10T09:00:00'),
          codigoBarrasMuestra: 'M20230001',
          usuario: 'Usuario Ejemplo',
          estado: 'correcto'
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {
    // Inicializar localStorage al crear el servicio
    this.initializeLocalStorage();
  }

  // Método para inicializar los datos de localStorage
  private initializeLocalStorage() {
    if (!localStorage.getItem('localizaciones')) {
      localStorage.setItem('localizaciones', JSON.stringify(this.localizacionesMock));
    }
    
    if (!localStorage.getItem('muestras')) {
      localStorage.setItem('muestras', JSON.stringify(this.muestrasMock));
    }
    
    if (!localStorage.getItem('cargas')) {
      localStorage.setItem('cargas', JSON.stringify(this.cargasMock));
    }
  }
  
  // Método para obtener localizaciones desde localStorage
  private getLocalizacionesFromStorage(): Localizacion[] {
    const localizacionesStr = localStorage.getItem('localizaciones');
    return localizacionesStr ? JSON.parse(localizacionesStr) : [];
  }
  
  // Método para obtener muestras desde localStorage
// Método para obtener muestras desde localStorage
private getMuestrasFromStorage(): Muestra[] {
  const muestrasStr = localStorage.getItem('muestras');
  let muestras: Muestra[] = muestrasStr ? JSON.parse(muestrasStr) : [];
  
  // Convertir fechas de string a Date
  muestras.forEach((m: Muestra) => {
    m.fechaRegistro = new Date(m.fechaRegistro);
  });
  
  return muestras;
}
  
  // Método para obtener cargas desde localStorage
  private getCargasFromStorage(): Carga[] {
    const cargasStr = localStorage.getItem('cargas');
    let cargas = cargasStr ? JSON.parse(cargasStr) : [];
    
    // Convertir fechas de string a Date
    cargas.forEach((c: any) => {
      c.fechaCarga = new Date(c.fechaCarga);
      c.registros.forEach((r: any) => {
        r.fechaRegistro = new Date(r.fechaRegistro);
      });
    });
    
    return cargas;
  }
  
  // Método para guardar localizaciones en localStorage
  private saveLocalizacionesToStorage(localizaciones: Localizacion[]) {
    localStorage.setItem('localizaciones', JSON.stringify(localizaciones));
  }
  
  // Método para guardar muestras en localStorage
  private saveMuestrasToStorage(muestras: Muestra[]) {
    localStorage.setItem('muestras', JSON.stringify(muestras));
  }
  
  // Método para guardar cargas en localStorage
  private saveCargasToStorage(cargas: Carga[]) {
    localStorage.setItem('cargas', JSON.stringify(cargas));
  }
  
  // Método para limpiar todos los datos almacenados (útil para pruebas)
  public resetStorageData() {
    localStorage.removeItem('localizaciones');
    localStorage.removeItem('muestras');
    localStorage.removeItem('cargas');
    this.initializeLocalStorage();
  }

  // Método de clonación profunda para evitar referencias compartidas
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  // === LOCALIZACIONES ===

  getLocalizaciones(filtros?: any): Observable<Localizacion[]> {
    // Obtener localizaciones desde localStorage
    let resultado = this.getLocalizacionesFromStorage();
    
    if (filtros) {
      if (filtros.tipoLocalizacion && filtros.tipoLocalizacion !== 'todas') {
        resultado = resultado.filter(loc => loc.tipoLocalizacion === filtros.tipoLocalizacion);
      }
      
      if (filtros.sedeCP) {
        resultado = resultado.filter(loc => loc.sedeCP.includes(filtros.sedeCP));
      }
      
      if (filtros.plantaEdificio) {
        resultado = resultado.filter(loc => loc.plantaEdificio && loc.plantaEdificio.includes(filtros.plantaEdificio));
      }
      
      if (filtros.descripcionLocalizacion) {
        resultado = resultado.filter(loc => 
          loc.descripcionLocalizacion.toLowerCase().includes(filtros.descripcionLocalizacion.toLowerCase())
        );
      }
      
      if (filtros.codigoBarras) {
        resultado = resultado.filter(loc => loc.codigoBarras.includes(filtros.codigoBarras));
      }
    }
    
    return of(resultado);
  }

  getLocalizacion(id: number): Observable<Localizacion> {
    const localizaciones = this.getLocalizacionesFromStorage();
    const localizacion = localizaciones.find(loc => loc.id === id);
    return of(localizacion ? this.deepClone(localizacion) : {} as Localizacion);
  }

  crearLocalizacion(localizacion: Localizacion): Observable<Localizacion> {
    // Obtener localizaciones actuales
    const localizaciones = this.getLocalizacionesFromStorage();
    
    // Simular la generación de un nuevo ID
    const nuevoId = Math.max(0, ...localizaciones.map(l => l.id || 0)) + 1;
    
    // Crear un objeto nuevo con el ID generado
    const nuevaLocalizacion: Localizacion = {
      ...localizacion,
      id: nuevoId,
      codigoBarras: this.generarCodigoBarrasLocalizacion(localizacion),
      tieneMuestras: false
    };
    
    // Si esta localización se marca como predeterminada, desmarcar las demás del mismo tipo
    if (nuevaLocalizacion.porDefecto) {
      localizaciones.forEach(loc => {
        if (loc.tipoLocalizacion === nuevaLocalizacion.tipoLocalizacion) {
          loc.porDefecto = false;
        }
      });
    }
    
    // Agregar la nueva localización a la lista
    localizaciones.push(nuevaLocalizacion);
    
    // Guardar en localStorage
    this.saveLocalizacionesToStorage(localizaciones);
    
    return of(this.deepClone(nuevaLocalizacion));
  }

  actualizarLocalizacion(localizacion: Localizacion): Observable<Localizacion> {
    // Obtener localizaciones actuales
    const localizaciones = this.getLocalizacionesFromStorage();
    
    // Buscar el índice de la localización en la lista
    const index = localizaciones.findIndex(loc => loc.id === localizacion.id);
    
    if (index !== -1) {
      // Si esta localización se marca como predeterminada, desmarcar las demás del mismo tipo
      if (localizacion.porDefecto) {
        localizaciones.forEach(loc => {
          if (loc.id !== localizacion.id && loc.tipoLocalizacion === localizacion.tipoLocalizacion) {
            loc.porDefecto = false;
          }
        });
      }
      
      // Actualizar la localización en la lista
      localizaciones[index] = {
        ...localizacion,
        codigoBarras: this.generarCodigoBarrasLocalizacion(localizacion)
      };
      
      // Guardar en localStorage
      this.saveLocalizacionesToStorage(localizaciones);
      
      return of(this.deepClone(localizaciones[index]));
    }
    
    return of({} as Localizacion);
  }

  eliminarLocalizacion(id: number): Observable<boolean> {
    // Obtener localizaciones y muestras actuales
    const localizaciones = this.getLocalizacionesFromStorage();
    const muestras = this.getMuestrasFromStorage();
    
    // Verificar si la localización tiene muestras asociadas
    const localizacion = localizaciones.find(loc => loc.id === id);
    
    if (localizacion && localizacion.tieneMuestras) {
      return of(false);
    }
    
    // Eliminar la localización de la lista
    const index = localizaciones.findIndex(loc => loc.id === id);
    
    if (index !== -1) {
      localizaciones.splice(index, 1);
      
      // Guardar en localStorage
      this.saveLocalizacionesToStorage(localizaciones);
      
      return of(true);
    }
    
    return of(false);
  }

  getPlantas(): Observable<string[]> {
    return of(['000', '001', '002', '003', '004', '005']); // Plantas de ejemplo
  }

  // === MUESTRAS ===

  getMuestras(filtros?: any): Observable<Muestra[]> {
    // Obtener muestras desde localStorage
    let resultado = this.getMuestrasFromStorage();
    
    if (filtros) {
      // Filtrar por tipo de registro (primero, histórico, último)
      if (filtros.tipoRegistro) {
        if (filtros.tipoRegistro === 'ultimo') {
          resultado = resultado.filter(m => m.esUltimoMovimiento);
        } 
        // Para 'historico' se devuelven todas las muestras
        // Para 'primero' se requeriría lógica adicional para identificar las primeras entradas
      }
      
      // Filtrar por fecha
      if (filtros.fechaDesde) {
        const fechaDesde = new Date(filtros.fechaDesde);
        resultado = resultado.filter(m => new Date(m.fechaRegistro) >= fechaDesde);
      }
      
      if (filtros.fechaHasta) {
        const fechaHasta = new Date(filtros.fechaHasta);
        resultado = resultado.filter(m => new Date(m.fechaRegistro) <= fechaHasta);
      }
      
      // Filtrar por tipo de localización
      if (filtros.tipoLocalizacion && filtros.tipoLocalizacion !== 'todas') {
        resultado = resultado.filter(m => m.localizacion.tipoLocalizacion === filtros.tipoLocalizacion);
      }
      
      // Filtrar por código de barras de localización
      if (filtros.codigoBarrasLocalizacion) {
        resultado = resultado.filter(m => m.localizacion.codigoBarras.includes(filtros.codigoBarrasLocalizacion));
      }
      
      // Filtrar por descripción de muestra
      if (filtros.descripcionMuestra) {
        resultado = resultado.filter(m => 
          m.descripcion && m.descripcion.toLowerCase().includes(filtros.descripcionMuestra.toLowerCase())
        );
      }
      
      // Filtrar por código de barras de muestra
      if (filtros.codigoBarrasMuestra) {
        resultado = resultado.filter(m => m.codigoBarras.includes(filtros.codigoBarrasMuestra));
      }
      
      // Filtrar por episodio
      if (filtros.episodio) {
        resultado = resultado.filter(m => 
          m.episodioNumero && m.episodioNumero.includes(filtros.episodio)
        );
      }
      
      // Filtrar por sujeto
      if (filtros.sujeto) {
        resultado = resultado.filter(m => 
          m.sujetoNombre && m.sujetoNombre.toLowerCase().includes(filtros.sujeto.toLowerCase())
        );
      }
      
      // Filtrar por usuario de registro
      if (filtros.usuarioRegistro) {
        resultado = resultado.filter(m => 
          m.usuario.toLowerCase().includes(filtros.usuarioRegistro.toLowerCase())
        );
      }
      
      // Filtrar por ID de localización (si se proporciona)
      if (filtros.localizacionId) {
        resultado = resultado.filter(m => m.localizacion.id === +filtros.localizacionId);
      }
    }
    
    return of(resultado.map(m => this.deepClone(m)));
  }

  getMuestra(id: number): Observable<Muestra> {
    const muestras = this.getMuestrasFromStorage();
    const muestra = muestras.find(m => m.id === id);
    return of(muestra ? this.deepClone(muestra) : {} as Muestra);
  }

  registrarMuestra(muestra: Muestra): Observable<Muestra> {
    // Obtener muestras y localizaciones actuales
    const muestras = this.getMuestrasFromStorage();
    const localizaciones = this.getLocalizacionesFromStorage();
    
    // Generar un nuevo ID
    const nuevoId = Math.max(0, ...muestras.map(m => m.id || 0)) + 1;
    
    // Verificar si el código de barras ya existe en el sistema
    const muestraExistente = muestras.some(m => 
      m.codigoBarras === muestra.codigoBarras && 
      m.localizacion.id === muestra.localizacion.id &&
      m.esUltimoMovimiento === true
    );

    
    
    // Si la muestra ya existe en esta localización, mostrar error
    if (muestraExistente) {
      return throwError(() => new Error("Esta muestra ya existe en esta localización"));
    }
    
    // Buscar localización por ID
    const localizacionCompleta = localizaciones.find(l => l.id === muestra.localizacion.id);
    if (!localizacionCompleta) {
      return throwError(() => new Error("Localización no encontrada"));
    }
    
    // Crear una nueva muestra con copia independiente de la localización
    const nuevaMuestra: Muestra = {
      ...muestra,
      id: nuevoId,
      fechaRegistro: new Date(),
      esUltimoMovimiento: true,
      localizacion: this.deepClone(localizacionCompleta)
    };
    
    // Marcar todas las muestras anteriores con el mismo código como no últimas
    muestras.forEach(m => {
      if (m.codigoBarras === nuevaMuestra.codigoBarras) {
        m.esUltimoMovimiento = false;
      }
    });
    
    // Marcar la localización como que tiene muestras
    const locIndex = localizaciones.findIndex(l => l.id === localizacionCompleta.id);
    if (locIndex !== -1) {
      localizaciones[locIndex].tieneMuestras = true;
      this.saveLocalizacionesToStorage(localizaciones);
    }
    
    // Agregar la nueva muestra
    muestras.push(nuevaMuestra);
    this.saveMuestrasToStorage(muestras);
    
    return of(this.deepClone(nuevaMuestra));
  }

  // Método auxiliar para depuración
  getMuestrasPorLocalizacionCodigoBarras(codigoBarras: string): Observable<Muestra[]> {
    const muestras = this.getMuestrasFromStorage();
    
    // Filtrar las muestras por el código de barras de la localización
    const muestrasFiltradas = muestras.filter(m => 
      m.localizacion && m.localizacion.codigoBarras === codigoBarras && 
      m.esUltimoMovimiento === true
    );
    
    return of(muestrasFiltradas.map(m => this.deepClone(m)));
  }

  actualizarMuestra(muestra: Muestra): Observable<Muestra> {
    // Obtener muestras actuales
    const muestras = this.getMuestrasFromStorage();
    
    // Buscar el índice de la muestra en la lista
    const index = muestras.findIndex(m => m.id === muestra.id);
    
    if (index !== -1) {
      // Actualizar la muestra en la lista con una copia para evitar referencias
      muestras[index] = this.deepClone(muestra);
      
      // Guardar en localStorage
      this.saveMuestrasToStorage(muestras);
      
      return of(this.deepClone(muestras[index]));
    }
    
    return of({} as Muestra);
  }

  eliminarMuestra(id: number): Observable<boolean> {
    // Obtener muestras y localizaciones actuales
    const muestras = this.getMuestrasFromStorage();
    const localizaciones = this.getLocalizacionesFromStorage();
    
    // Solo se pueden eliminar muestras que son el último movimiento
    const muestra = muestras.find(m => m.id === id);
    
    if (!muestra || !muestra.esUltimoMovimiento) {
      return of(false);
    }
    
    // Eliminar la muestra de la lista
    const index = muestras.findIndex(m => m.id === id);
    
    if (index !== -1) {
      const muestraEliminada = this.deepClone(muestras[index]);
      muestras.splice(index, 1);
      
      // Si esta era la única muestra en esta localización, actualizar la localización
      if (muestraEliminada.localizacion.id) {
        const mismaLocalizacion = muestras.some(m => 
          m.localizacion.id === muestraEliminada.localizacion.id
        );
        
        if (!mismaLocalizacion) {
          const locIndex = localizaciones.findIndex(loc => 
            loc.id === muestraEliminada.localizacion.id
          );
          
          if (locIndex !== -1) {
            localizaciones[locIndex].tieneMuestras = false;
            this.saveLocalizacionesToStorage(localizaciones);
          }
        }
      }
      
      // Si hay otras muestras con el mismo código de barras, marcar la más reciente como último movimiento
      const mismoCodigoBarras = muestras.filter(m => 
        m.codigoBarras === muestraEliminada.codigoBarras
      ).sort((a, b) => 
        new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
      );
      
      if (mismoCodigoBarras.length > 0) {
        const muestraIndex = muestras.findIndex(m => m.id === mismoCodigoBarras[0].id);
        if (muestraIndex !== -1) {
          muestras[muestraIndex].esUltimoMovimiento = true;
        }
      }
      
      // Guardar en localStorage
      this.saveMuestrasToStorage(muestras);
      
      return of(true);
    }
    
    return of(false);
  }

  getMuestrasPorLocalizacion(codigoBarrasLocalizacion: string): Observable<Muestra[]> {
    // Verificar si tenemos cache para esta localización
    if (this.muestrasCache.has(codigoBarrasLocalizacion)) {
      // Usar || [] para garantizar que siempre devolvemos un array
      return of(this.muestrasCache.get(codigoBarrasLocalizacion) || []);
    }
    
    // Si no hay cache, obtener los datos y cachearlos
    return this.getMuestras({ codigoBarrasLocalizacion }).pipe(
      tap(muestras => {
        this.muestrasCache.set(codigoBarrasLocalizacion, muestras);
      })
    );
  }
  
  // Método para limpiar cache (útil al crear/mover muestras)
  limpiarCache() {
    this.muestrasCache.clear();
  }

  // === CARGA DE CÓDIGOS ===

  guardarCarga(registros: any[]): Observable<Carga> {
    // Obtener cargas actuales
    const cargas = this.getCargasFromStorage();
    
    // Simular la generación de un nuevo ID
    const year = new Date().getFullYear();
    const nuevoId = parseInt(`${year}${String(cargas.length + 1).padStart(4, '0')}`);
    
    // Crear un objeto nuevo con el ID generado
    const nuevaCarga: Carga = {
      id: nuevoId,
      fechaCarga: new Date(),
      numeroDeMuestras: registros.length,
      usuarioCarga: 'Usuario Ejemplo', // En una implementación real, sería el usuario actual
      procesada: false,
      registros: registros.map(reg => ({
        ...reg,
        fechaRegistro: new Date(),
        usuario: 'Usuario Ejemplo', // En una implementación real, sería el usuario actual
        estado: 'correcto' // Estado inicial
      }))
    };
    
    // Agregar la nueva carga a la lista
    cargas.push(nuevaCarga);
    
    // Guardar en localStorage
    this.saveCargasToStorage(cargas);
    
    return of(this.deepClone(nuevaCarga));
  }

  procesarCarga(cargaId: number): Observable<Carga> {
    // Obtener cargas, muestras y localizaciones actuales
    const cargas = this.getCargasFromStorage();
    const muestras = this.getMuestrasFromStorage();
    const localizaciones = this.getLocalizacionesFromStorage();
    
    // Buscar el índice de la carga en la lista
    const index = cargas.findIndex(c => c.id === cargaId);
    
    if (index !== -1) {
      // Actualizar la carga como procesada
      cargas[index].procesada = true;
      
      // Procesar cada registro
      cargas[index].registros.forEach(registro => {
        // Buscar la localización por código de barras
        const localizacion = localizaciones.find(loc => 
          loc.codigoBarras === registro.codigoBarrasLocalizacion
        );
        
        if (localizacion) {
          // Hacer una copia profunda de la localización para evitar referencias compartidas
          const localizacionCopia = this.deepClone(localizacion);
          
          // Verificar si la muestra ya existe
          const muestraExistente = muestras.find(m => 
            m.codigoBarras === registro.codigoBarrasMuestra && 
            m.localizacion.id === localizacion.id &&
            m.esUltimoMovimiento
          );
          
          if (muestraExistente) {
            // La muestra ya existe en esta localización
            registro.estado = 'existente';
          } else {
            // Crear una nueva muestra
            const nuevaMuestra: Muestra = {
              id: Math.max(0, ...muestras.map(m => m.id || 0)) + 1,
              codigoBarras: registro.codigoBarrasMuestra,
              fechaRegistro: registro.fechaRegistro,
              usuario: registro.usuario,
              localizacion: localizacionCopia,
              esUltimoMovimiento: true
            };
            
            // Marcar muestras anteriores como no último movimiento
            muestras.forEach(m => {
              if (m.codigoBarras === nuevaMuestra.codigoBarras) {
                m.esUltimoMovimiento = false;
              }
            });
            
            // Marcar la localización como que tiene muestras
            const locIndex = localizaciones.findIndex(loc => loc.id === localizacion.id);
            if (locIndex !== -1) {
              localizaciones[locIndex].tieneMuestras = true;
            }
            
            // Agregar la nueva muestra a la lista
            muestras.push(nuevaMuestra);
            
            registro.estado = 'correcto';
          }
        } else {
          // La localización no existe
          registro.estado = 'error';
        }
      });
      
      // Guardar en localStorage
      this.saveCargasToStorage(cargas);
      this.saveMuestrasToStorage(muestras);
      this.saveLocalizacionesToStorage(localizaciones);
      
      return of(this.deepClone(cargas[index]));
    }
    
    return of({} as Carga);
  }

  getCargas(filtros?: any): Observable<Carga[]> {
    // Obtener cargas desde localStorage
    let resultado = this.getCargasFromStorage();
    
    if (filtros) {
      // Filtrar por procesada
      if (filtros.procesada !== undefined) {
        resultado = resultado.filter(c => c.procesada === filtros.procesada);
      }
      
      // Filtrar por fecha
      if (filtros.fechaDesde) {
        const fechaDesde = new Date(filtros.fechaDesde);
        resultado = resultado.filter(c => new Date(c.fechaCarga) >= fechaDesde);
      }
      
      if (filtros.fechaHasta) {
        const fechaHasta = new Date(filtros.fechaHasta);
        resultado = resultado.filter(c => new Date(c.fechaCarga) <= fechaHasta);
      }
    }
    
    return of(resultado.map(c => this.deepClone(c)));
  }

  eliminarCarga(id: number): Observable<boolean> {
    // Obtener cargas actuales
    const cargas = this.getCargasFromStorage();
    
    // No se pueden eliminar cargas procesadas
    const carga = cargas.find(c => c.id === id);
    
    if (!carga || carga.procesada) {
      return of(false);
    }
    
    // Eliminar la carga de la lista
    const index = cargas.findIndex(c => c.id === id);
    
    if (index !== -1) {
      cargas.splice(index, 1);
      
      // Guardar en localStorage
      this.saveCargasToStorage(cargas);
      
      return of(true);
    }
    
    return of(false);
  }

  // === GENERACIÓN DE CÓDIGOS DE BARRAS ===

  generarCodigoBarrasLocalizacion(localizacion: Localizacion): string {
    return `${localizacion.etiquetaLocalizacion}${localizacion.sedeCP}${localizacion.tipoLocalizacion === 'local' ? localizacion.plantaEdificio : ''}${localizacion.numeroIncremental}`;
  }
  
  obtenerSiguienteNumeroIncremental(tipoLocalizacion: string): string {
    // Obtener localizaciones actuales
    const localizaciones = this.getLocalizacionesFromStorage();
    
    // Obtener localizaciones del mismo tipo
    const localizacionesMismoTipo = localizaciones.filter(
      loc => loc.tipoLocalizacion === tipoLocalizacion
    );
    
    // Si no hay localizaciones del mismo tipo, empezar con 0001
    if (localizacionesMismoTipo.length === 0) {
      return '0001';
    }
    
    // Obtener el máximo número incremental y sumarle 1
    const maxNumero = Math.max(
      ...localizacionesMismoTipo.map(loc => parseInt(loc.numeroIncremental))
    );
    
    // Formatear el número con ceros a la izquierda
    return (maxNumero + 1).toString().padStart(4, '0');
  }
  
  generarCodigoBarrasMuestra(): string {
    // Obtener muestras actuales
    const muestras = this.getMuestrasFromStorage();
    
    // Formato: M + año actual + secuencial de 4 dígitos
    const year = new Date().getFullYear();
    const secuencial = (muestras.length + 1).toString().padStart(4, '0');
    
    return `M${year}${secuencial}`;
  }

  // === GESTIÓN DE ERRORES ===

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} falló: ${error.message}`);
      // Devuelve un resultado vacío para seguir la ejecución
      return of(result as T);
    };
  }

  verificarMuestraExistente(codigoBarras: string, localizacionId?: number): Observable<boolean> {
    // Si no hay ID de localización, no se puede verificar la existencia
    if (!localizacionId) {
      return of(false);
    }
    
    const muestras = this.getMuestrasFromStorage();
    
    // Verificar si existe una muestra con el mismo código de barras en la misma localización
    // que tenga esUltimoMovimiento = true
    const existe = muestras.some(m => 
      m.codigoBarras === codigoBarras && 
      m.localizacion.id === localizacionId && 
      m.esUltimoMovimiento === true
    );
    
    return of(existe);
  }

  // Método para obtener muestras por ID de localización
getMuestrasPorLocalizacionId(localizacionId: number): Observable<Muestra[]> {
  // Reutilizamos el método getMuestras que ya tiene la lógica para filtrar por ID
  return this.getMuestras({ localizacionId });
}
}