import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MuestrasService } from 'src/app/services/muestras.service';

interface RegistroCarga {
  codigoBarrasLocalizacion: string;
  descripcionLocalizacion: string;
  fechaRegistro: Date;
  codigoBarrasMuestra: string;
  usuario: string;
  estado: 'correcto' | 'existente' | 'error' | null;
}

@Component({
  selector: 'app-carga-codigos',
  templateUrl: './carga-codigos.component.html',
  styleUrls: ['./carga-codigos.component.css']
})
export class CargaCodigosComponent implements OnInit {
  textoCarga: string = '';
  procesandoDatos: boolean = false;
  puedeAceptarProcesamiento: boolean = false;
  datosRegistros: RegistroCarga[] = [];
  cargaId: number | null = null;
  usuarioActual: string = 'usuario_actual'; // En una implementación real, se obtendría del servicio de autenticación
  
  columnasVisibles: string[] = [
    'codigoBarrasLocalizacion',
    'descripcionLocalizacion',
    'fechaRegistro',
    'codigoBarrasMuestra',
    'usuario',
    'estado',
    'opciones'
  ];

  constructor(
    private muestrasService: MuestrasService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Asegurar que el input de carga esté enfocado al iniciar
    setTimeout(() => {
      document.getElementById('codigosCargaInput')?.focus();
    }, 500);
  }

  procesarCarga(): void {
    if (!this.textoCarga || this.procesandoDatos) {
      return;
    }
    
    this.procesandoDatos = true;
    
    try {
      // Guardar primero la carga si no se ha guardado
      if (!this.cargaId) {
        this.guardarDescargaInterna();
      }
      
      // Procesar los registros para verificar su validez
      this.muestrasService.procesarCarga(this.cargaId!).subscribe(
        carga => {
          this.datosRegistros = carga.registros;
          
          // Verificar si hay errores que impiden el procesamiento
          const hayErrores = this.datosRegistros.some(reg => reg.estado === 'error');
          this.puedeAceptarProcesamiento = !hayErrores;
          
          if (hayErrores) {
            this.snackBar.open(`La carga con nº ${this.cargaId} se ha procesado con errores.`, 'Cerrar', {
              duration: 5000,
              panelClass: ['warning-snackbar']
            });
          } else {
            this.snackBar.open(`La carga con nº ${this.cargaId} se ha procesado sin errores.`, 'Cerrar', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          }
          
          this.procesandoDatos = false;
        },
        error => {
          this.snackBar.open('Error al procesar la carga.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.procesandoDatos = false;
        }
      );
    } catch (error) {
      this.snackBar.open('Error al procesar la carga.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.procesandoDatos = false;
    }
  }

  guardarDescarga(): void {
    if (!this.textoCarga || this.procesandoDatos) {
      return;
    }
    
    this.guardarDescargaInterna();
    
    this.snackBar.open(`La carga ha sido guardada con el nº: ${this.cargaId}`, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private guardarDescargaInterna(): void {
    this.procesandoDatos = true;
    
    try {
      // Parsear los datos de la carga
      const registros = this.parsearDatosCarga(this.textoCarga);
      
      // Guardar la carga en el servicio
      this.muestrasService.guardarCarga(registros).subscribe(
        carga => {
          this.cargaId = carga.id;
          this.datosRegistros = carga.registros;
          this.procesandoDatos = false;
        },
        error => {
          this.snackBar.open('Error al guardar la descarga.', 'Cerrar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.procesandoDatos = false;
        }
      );
    } catch (error) {
      this.snackBar.open('Error al procesar los datos de la carga.', 'Cerrar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      this.procesandoDatos = false;
    }
  }

  private parsearDatosCarga(texto: string): RegistroCarga[] {
    // En una implementación real, esta función analizaría el texto escaneado
    // para extraer los códigos de barras de localizaciones y muestras
    
    // Implementación simplificada para demostración:
    const lineas = texto.trim().split('\n');
    const registros: RegistroCarga[] = [];
    
    let localizacionActual: string = '';
    let descripcionLocalizacion: string = '';
    
    for (let linea of lineas) {
      linea = linea.trim();
      
      if (!linea) continue;
      
      // Detectar si es una localización o una muestra
      if (linea.startsWith('LI') || linea.startsWith('LE')) {
        // Es una localización
        localizacionActual = linea;
        // En una implementación real, se buscaría la descripción en la base de datos
        descripcionLocalizacion = `Localización ${linea.substr(0, 2)}`;
      } else {
        // Asumimos que es una muestra
        if (localizacionActual) {
          registros.push({
            codigoBarrasLocalizacion: localizacionActual,
            descripcionLocalizacion: descripcionLocalizacion,
            fechaRegistro: new Date(),
            codigoBarrasMuestra: linea,
            usuario: this.usuarioActual,
            estado: null
          });
        }
      }
    }
    
    return registros;
  }

  eliminarRegistro(index: number): void {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.datosRegistros.splice(index, 1);
      
      // Verificar si hay errores que impiden el procesamiento
      const hayErrores = this.datosRegistros.some(reg => reg.estado === 'error');
      this.puedeAceptarProcesamiento = !hayErrores;
    }
  }

  aceptarProcesamiento(): void {
    if (!this.puedeAceptarProcesamiento || this.procesandoDatos) {
      return;
    }
    
    this.procesandoDatos = true;
    
    // Aquí se realizaría la finalización del procesamiento, actualizando
    // las muestras en el sistema según los registros
    
    this.snackBar.open('Carga procesada correctamente.', 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    
    // Limpiar datos y resetear formulario
    this.textoCarga = '';
    this.datosRegistros = [];
    this.cargaId = null;
    this.puedeAceptarProcesamiento = false;
    this.procesandoDatos = false;
  }

  cargarCodigosBarras(): void {
    // Resetear el formulario para una nueva carga
    this.textoCarga = '';
    this.datosRegistros = [];
    this.cargaId = null;
    this.puedeAceptarProcesamiento = false;
    
    setTimeout(() => {
      document.getElementById('codigosCargaInput')?.focus();
    }, 100);
  }

  getEstadoTexto(estado: string | null): string {
    switch (estado) {
      case 'correcto':
        return 'Correcto';
      case 'existente':
        return 'Ya existe';
      case 'error':
        return 'Error';
      default:
        return 'Pendiente';
    }
  }

  volver(): void {
    this.router.navigate(['/gestion-muestras']);
  }
}