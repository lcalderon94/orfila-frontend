import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RemisionMuestrasService } from '../../../services/remision-muestras.service';
import { DocumentoService } from '../../../services/documento.service';
import { DocumentoAsociado, TAREAS_COMPLETAS } from '../../../mock-data/tareas.mock';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-remision-muestras',
  templateUrl: './remision-muestras.component.html',
  styleUrls: ['./remision-muestras.component.css']
})
export class RemisionMuestrasComponent implements OnInit, OnDestroy {
  pasoActual = 1;
  totalPasos = 7;
  pasoTitulos = [
    'Datos básicos del informe',
    'Datos del solicitante',
    'Datos del asunto',
    'Estudios solicitados',
    'Sujetos a estudio',
    'Muestras para estudio',
    'Cadena de custodia'
  ];
  private subscription = new Subscription();

  constructor(
    private remisionService: RemisionMuestrasService,
    private documentoService: DocumentoService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el paso actual
    this.subscription.add(
      this.remisionService.pasoActual$.subscribe(paso => {
        this.pasoActual = paso;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  irAPaso(paso: number): void {
    // Solo permitimos navegar a pasos anteriores o al siguiente paso
    if (paso < this.pasoActual || paso === this.pasoActual + 1) {
      this.remisionService.irAPaso(paso);
    }
  }

  siguientePaso(): void {
    this.remisionService.avanzarPaso();
  }

  pasoAnterior(): void {
    this.remisionService.retrocederPaso();
  }

  finalizar(): void {
    this.remisionService.generarInforme().subscribe(
      resultado => {
        if (resultado.success) {
          // Crear documento simplificado
          const nuevoDocumento: DocumentoAsociado = {
            id: 'DOC' + Date.now(),
            nombre: resultado.informe.nombre || 'Informe de remisión de muestras',
            tipo: resultado.informe.tipo || 'Informe de remisión de muestras al INTCF',
            estado: 'Completado',
            fechaCreacion: new Date(),
            autor: '30000332C',
            numAnio: resultado.informe.numero || '',
            numEpisodio: '',
            autorInforme: '30000332C'
          };
          
          // Agregar documento directamente
          this.documentoService.agregarDocumento(nuevoDocumento);
          
          this.snackBar.open('Informe generado correctamente', 'Cerrar', {
            duration: 3000
          });
          
          // Resetear datos
          this.remisionService.reiniciarDatos();
          
          // Navegar a la lista de documentos
          this.router.navigate(['/consulta-documentos']);
        } else {
          this.snackBar.open('Error al generar el informe', 'Cerrar', {
            duration: 3000
          });
        }
      },
      error => {
        this.snackBar.open('Error al generar el informe', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }
  
  // Método para buscar el episodio adecuado según los datos del informe
  private buscarEpisodioCoincidente(informe: any): string {
    // Si tenemos una referencia directa, la usamos
    if (informe.referenciaRemitente && this.existeEpisodio(informe.referenciaRemitente)) {
      return informe.referenciaRemitente;
    }
    
    // Buscar por órgano y número
    if (informe.organo && informe.numero) {
      for (const [key, tarea] of Object.entries(TAREAS_COMPLETAS)) {
        if (tarea.episodio.organismo === informe.organo && 
            tarea.episodio.nAnio === informe.numero) {
          return key;
        }
      }
    }
    
    // Buscar solo por órgano
    if (informe.organo) {
      for (const [key, tarea] of Object.entries(TAREAS_COMPLETAS)) {
        if (tarea.episodio.organismo === informe.organo) {
          return key;
        }
      }
    }
    
    // Si no encontramos coincidencia, usar el primer episodio disponible
    const primerKey = Object.keys(TAREAS_COMPLETAS)[0];
    return primerKey;
  }
  
  // Verificar si un episodio existe
  private existeEpisodio(id: string): boolean {
    return !!TAREAS_COMPLETAS[id];
  }
  cancelar(): void {
    // Preguntar si está seguro de cancelar
    if (confirm('¿Está seguro de que desea cancelar? Se perderán todos los datos introducidos.')) {
      this.remisionService.reiniciarDatos();
      this.router.navigate(['/consulta-documentos']);
    }
  }

  esPasoCompletado(paso: number): boolean {
    // En una implementación real, validaríamos si los datos del paso están completos
    // Para este prototipo, consideramos que un paso está completado si es menor al actual
    return paso < this.pasoActual;
  }
}