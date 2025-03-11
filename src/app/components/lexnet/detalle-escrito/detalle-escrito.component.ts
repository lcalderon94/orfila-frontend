// detalle-escrito.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService, DetalleNotificacion, DocumentoLexnet } from 'src/app/services/lexnet.service';

@Component({
  selector: 'app-detalle-escrito',
  templateUrl: './detalle-escrito.component.html',
  styleUrls: ['./detalle-escrito.component.css']
})
export class DetalleEscritoComponent implements OnInit {
  escritoId: string = '';
  escrito: DetalleNotificacion | null = null;
  documentosSeleccionados: string[] = [];
  episodioExistente: boolean = true; // Los escritos siempre vienen con un episodio existente
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService
  ) { }

  ngOnInit(): void {
    this.escritoId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.escritoId) {
      this.cargarEscrito();
    } else {
      this.snackBar.open('ID de escrito no válido', 'Cerrar', { duration: 3000 });
      this.volver();
    }
  }

  cargarEscrito(): void {
    this.cargando = true;
    
    this.lexnetService.getDetalleEscrito(this.escritoId).subscribe({
      next: (escrito) => {
        this.escrito = escrito;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar el escrito:', error);
        this.snackBar.open('Error al cargar el escrito', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  toggleSeleccionDocumento(documentoId: string): void {
    const index = this.documentosSeleccionados.indexOf(documentoId);
    if (index === -1) {
      this.documentosSeleccionados.push(documentoId);
    } else {
      this.documentosSeleccionados.splice(index, 1);
    }
  }

  irAEpisodio(): void {
    // Verificar si existe un episodio para este escrito
    if (this.escrito) {
      this.lexnetService.verificarExisteEpisodio(
        this.escrito.remitente,
        this.escrito.tipoProcedimiento,
        this.escrito.nAnio,
        this.escrito.tipoMensaje // Añadimos el tipo de mensaje para que identifique que es un Escrito
      ).subscribe({
        next: (resultado) => {
          if (resultado.existe && resultado.episodioId) {
            this.snackBar.open('Redirigiendo al episodio...', 'Cerrar', { duration: 2000 });
            this.router.navigate(['/episodios/modificar', resultado.episodioId]);
          } else {
            this.snackBar.open('No se encontró un episodio asociado a este escrito', 'Cerrar', { duration: 3000 });
          }
        },
        error: (error) => {
          console.error('Error al verificar episodio:', error);
          this.snackBar.open('Error al verificar episodio', 'Cerrar', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('No hay datos del escrito para buscar el episodio', 'Cerrar', { duration: 3000 });
    }
  }

  anadirSeleccionados(): void {
    if (this.documentosSeleccionados.length === 0) {
      this.snackBar.open('Seleccione al menos un documento', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (this.escrito) {
      this.lexnetService.verificarExisteEpisodio(
        this.escrito.remitente,
        this.escrito.tipoProcedimiento,
        this.escrito.nAnio,
        this.escrito.tipoMensaje
      ).subscribe({
        next: (resultado) => {
          if (resultado.existe && resultado.episodioId) {
            this.lexnetService.asociarMultiplesDocumentosAEpisodio(
              this.documentosSeleccionados, 
              resultado.episodioId
            ).subscribe({
              next: () => {
                this.snackBar.open(`${this.documentosSeleccionados.length} documentos añadidos al episodio`, 'Cerrar', { duration: 2000 });
              }
            });
          } else {
            this.snackBar.open('No se encontró un episodio asociado para añadir los documentos', 'Cerrar', { duration: 3000 });
          }
        }
      });
    }
  }

  anadirTodos(): void {
    if (!this.escrito || !this.escrito?.documentos?.length) {
      this.snackBar.open('No hay documentos para añadir', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.lexnetService.verificarExisteEpisodio(
      this.escrito.remitente,
      this.escrito.tipoProcedimiento,
      this.escrito.nAnio,
      this.escrito.tipoMensaje
    ).subscribe({
      next: (resultado) => {
        if (resultado.existe && resultado.episodioId) {
          // Add the non-null assertion operator (!) here
          const documentosIds = this.escrito!.documentos.map(doc => doc.id);
          this.lexnetService.asociarMultiplesDocumentosAEpisodio(documentosIds, resultado.episodioId).subscribe({
            next: () => {
              this.snackBar.open(`${documentosIds.length} documentos añadidos al episodio`, 'Cerrar', { duration: 2000 });
            }
          });
        } else {
          this.snackBar.open('No se encontró un episodio asociado para añadir los documentos', 'Cerrar', { duration: 3000 });
        }
      }
    });
  }

  visualizarDocumento(documento: DocumentoLexnet): void {
    this.snackBar.open(`Visualizando documento: ${documento.nombre}`, 'Cerrar', { duration: 2000 });
    // Aquí iría la lógica para visualizar el documento
  }

  anadirDocumentoAEpisodio(documento: DocumentoLexnet): void {
    if (this.escrito) {
      this.lexnetService.verificarExisteEpisodio(
        this.escrito.remitente,
        this.escrito.tipoProcedimiento,
        this.escrito.nAnio,
        this.escrito.tipoMensaje
      ).subscribe({
        next: (resultado) => {
          if (resultado.existe && resultado.episodioId) {
            this.lexnetService.asociarDocumentoAEpisodio(documento.id, resultado.episodioId).subscribe({
              next: (res) => {
                if (res) {
                  this.snackBar.open(`Documento "${documento.nombre}" añadido al episodio`, 'Cerrar', { duration: 2000 });
                } else {
                  this.snackBar.open('Error al añadir el documento al episodio', 'Cerrar', { duration: 3000 });
                }
              }
            });
          } else {
            this.snackBar.open('No se encontró un episodio asociado para añadir el documento', 'Cerrar', { duration: 3000 });
          }
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/lexnet/mensajes-recibidos']);
  }
}