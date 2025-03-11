// detalle-notificacion.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SelectionModel } from '@angular/cdk/collections';
import { LexnetService, DetalleNotificacion, DocumentoLexnet } from '../../../services/lexnet.service';
import { EpisodiosService } from '../../../services/episodio.service';

@Component({
  selector: 'app-detalle-notificacion',
  templateUrl: './detalle-notificacion.component.html',
  styleUrls: ['./detalle-notificacion.component.css']
})
export class DetalleNotificacionComponent implements OnInit {
  notificacionId: string = '';
  notificacion: DetalleNotificacion | null = null;
  episodioExistente: boolean = false;
  episodioId: string = '';
  cargando: boolean = true;
  selection = new SelectionModel<DocumentoLexnet>(true, []);
  columnas: string[] = ['seleccion', 'nombre', 'descripcion', 'opciones'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService,
    private episodiosService: EpisodiosService
  ) { }

  ngOnInit(): void {
    this.notificacionId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.notificacionId) {
      this.cargarNotificacion();
    } else {
      this.snackBar.open('ID de notificación no válido', 'Cerrar', { duration: 3000 });
      this.volver();
    }
  }

  cargarNotificacion(): void {
    this.cargando = true;
    
    this.lexnetService.getDetalleNotificacion(this.notificacionId).subscribe({
      next: (notificacion) => {
        this.notificacion = notificacion;
        this.verificarExistenciaEpisodio();
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar la notificación:', error);
        this.snackBar.open('Error al cargar la notificación', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  verificarExistenciaEpisodio(): void {
    if (this.notificacion) {
      this.lexnetService.verificarExisteEpisodio(
        this.notificacion.remitente,
        this.notificacion.tipoProcedimiento,
        this.notificacion.nAnio
      ).subscribe({
        next: (respuesta) => {
          this.episodioExistente = respuesta.existe;
          this.episodioId = respuesta.episodioId || '';
        },
        error: (error) => {
          console.error('Error al verificar existencia del episodio:', error);
          this.episodioExistente = false;
        }
      });
    }
  }

  /** Función para determinar si todos los elementos están seleccionados */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.notificacion?.documentos.length || 0;
    return numSelected === numRows;
  }

  /** Selecciona/deselecciona todos los elementos */
  masterToggle() {
    if (this.notificacion) {
      this.isAllSelected() ?
        this.selection.clear() :
        this.notificacion.documentos.forEach(documento => this.selection.select(documento));
    }
  }

  /** Maneja el clic en el checkbox de selección */
  checkboxLabel(documento?: DocumentoLexnet): string {
    if (!documento) {
      return `${this.isAllSelected() ? 'deseleccionar' : 'seleccionar'} todo`;
    }
    return `${this.selection.isSelected(documento) ? 'deseleccionar' : 'seleccionar'} documento`;
  }

  /** Visualizar un documento */
  visualizarDocumento(documento: DocumentoLexnet): void {
    console.log('Visualizando documento:', documento);
    this.snackBar.open(`Visualizando documento: ${documento.nombre}`, 'Cerrar', { duration: 2000 });
    
    // Aquí podríamos abrir una ventana de visualización o descargar el documento
    // según lo que indique el manual - por ahora simulamos la acción
    window.open(`/assets/mock/documentos/${documento.nombre}`, '_blank');
  }

  /** Añadir un documento al episodio */
  anadirDocumentoAEpisodio(documento: DocumentoLexnet): void {
    if (this.episodioExistente && this.episodioId) {
      this.lexnetService.asociarDocumentoAEpisodio(documento.id, this.episodioId).subscribe({
        next: (resultado) => {
          if (resultado) {
            this.snackBar.open(`Documento "${documento.nombre}" añadido al episodio`, 'Cerrar', { duration: 2000 });
          } else {
            this.snackBar.open('Error al añadir el documento al episodio', 'Cerrar', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Error al añadir documento:', error);
          this.snackBar.open('Error al añadir el documento al episodio', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      // Si no existe el episodio, redirigimos al componente para asociar
      this.router.navigate(['/lexnet/agregar-documento-episodio', documento.id]);
    }
  }

  /** Ir al episodio existente */
  irAEpisodio(): void {
    if (this.episodioExistente && this.episodioId) {
      this.router.navigate(['/episodios/modificar', this.episodioId]);
    } else {
      this.snackBar.open('No se encontró un episodio asociado', 'Cerrar', { duration: 3000 });
    }
  }

  /** Crear nuevo episodio */
  crearEpisodio(): void {
    if (!this.notificacion) return;
    
    // Navegamos a la creación de episodio pasando los datos de la notificación
    // Podemos pasar los datos como parámetros de consulta o en el estado de navegación
    this.router.navigate(['/episodios/nuevo'], {
      queryParams: {
        tipoSolicitante: 'juzgado',
        remitente: this.notificacion.remitente,
        tipoProcedimiento: this.notificacion.tipoProcedimiento,
        nAnio: this.notificacion.nAnio,
        nig: this.notificacion.nig
      }
    });
  }

  /** Añadir documentos seleccionados al episodio */
  anadirSeleccionados(): void {
    if (this.selection.selected.length === 0) {
      this.snackBar.open('No hay documentos seleccionados', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (this.episodioExistente && this.episodioId) {
      // Añadir los documentos seleccionados al episodio
      const documentosIds = this.selection.selected.map(doc => doc.id);
      this.lexnetService.asociarMultiplesDocumentosAEpisodio(documentosIds, this.episodioId).subscribe({
        next: () => {
          this.snackBar.open(`${documentosIds.length} documentos añadidos al episodio`, 'Cerrar', { duration: 2000 });
        },
        error: (error) => {
          console.error('Error al añadir documentos:', error);
          this.snackBar.open('Error al añadir los documentos al episodio', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('No hay un episodio asociado para añadir los documentos', 'Cerrar', { duration: 3000 });
    }
  }

  /** Añadir todos los documentos al episodio */
  anadirTodos(): void {
    if (!this.notificacion || this.notificacion.documentos.length === 0) {
      this.snackBar.open('No hay documentos para añadir', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (this.episodioExistente && this.episodioId) {
      // Añadir todos los documentos al episodio
      const documentosIds = this.notificacion.documentos.map(doc => doc.id);
      this.lexnetService.asociarMultiplesDocumentosAEpisodio(documentosIds, this.episodioId).subscribe({
        next: () => {
          this.snackBar.open(`${documentosIds.length} documentos añadidos al episodio`, 'Cerrar', { duration: 2000 });
        },
        error: (error) => {
          console.error('Error al añadir documentos:', error);
          this.snackBar.open('Error al añadir los documentos al episodio', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('No hay un episodio asociado para añadir los documentos', 'Cerrar', { duration: 3000 });
    }
  }

  /** Volver a la pantalla anterior */
  volver(): void {
    this.router.navigate(['/lexnet/mensajes-recibidos']);
  }
}