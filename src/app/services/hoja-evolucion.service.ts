import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interfaz que representa una “hoja de evolución”.
 * Ajusta los campos según tus necesidades.
 */
export interface HojaEvolucion {
  id: number;
  tareaId: string;
  fecha: Date;
  usuario: string;
  detalle: string;
}

@Injectable({
  providedIn: 'root'
})
export class HojaEvolucionService {

  // Este BehaviorSubject almacena las hojas en memoria.
  // Mientras la app no se refresque o cierre, mantiene el estado.
  private hojasSubject = new BehaviorSubject<HojaEvolucion[]>([]);

  constructor() {
    // Si quieres cargar datos iniciales, puedes hacer algo así:
    // this.hojasSubject.next([
    //   {
    //     id: 1,
    //     tareaId: 'TAREA_INICIAL',
    //     fecha: new Date('2023-01-01T10:00:00'),
    //     usuario: 'Usuario de Ejemplo',
    //     detalle: 'Nota de evolución inicial'
    //   }
    // ]);
  }

  /**
   * Devuelve un `Observable` para que puedas suscribirte
   * a los cambios en la lista de hojas.
   */
  getHojas$(): Observable<HojaEvolucion[]> {
    return this.hojasSubject.asObservable();
  }

  /**
   * Retorna la lista actual de hojas (sin suscribirse).
   */
  getHojasActuales(): HojaEvolucion[] {
    return this.hojasSubject.value;
  }

  /**
   * Añade una nueva hoja.
   */
  addHoja(nuevaHoja: HojaEvolucion): void {
    const hojasActuales = this.getHojasActuales();
    hojasActuales.push(nuevaHoja);
    // Notificamos el cambio:
    this.hojasSubject.next(hojasActuales);
  }

  /**
   * Elimina una hoja por su ID.
   */
  removeHoja(id: number): void {
    let hojasActuales = this.getHojasActuales();
    hojasActuales = hojasActuales.filter(h => h.id !== id);
    // Notificamos el cambio:
    this.hojasSubject.next(hojasActuales);
  }

  /**
   * Reemplaza todas las hojas a la vez
   * (opcional, si quieres sobrescribir el estado).
   */
  setHojas(nuevasHojas: HojaEvolucion[]): void {
    this.hojasSubject.next(nuevasHojas);
  }
}
