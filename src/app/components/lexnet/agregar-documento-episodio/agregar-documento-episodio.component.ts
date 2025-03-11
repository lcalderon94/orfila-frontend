// agregar-documento-episodio.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService, DocumentoLexnet } from 'src/app/services/lexnet.service';
import { EpisodiosService } from 'src/app/services/episodio.service';

@Component({
  selector: 'app-agregar-documento-episodio',
  templateUrl: './agregar-documento-episodio.component.html',
  styleUrls: ['./agregar-documento-episodio.component.css']
})
export class AgregarDocumentoEpisodioComponent implements OnInit {
  episodioId: string = '';
  documentoId: string = '';
  documento: DocumentoLexnet | null = null;
  episodios: any[] = [];
  formulario: FormGroup;
  cargando: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService,
    private episodiosService: EpisodiosService
  ) {
    this.formulario = this.fb.group({
      episodioId: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.documentoId = this.route.snapshot.paramMap.get('documentoId') || '';
    this.episodioId = this.route.snapshot.queryParamMap.get('episodioId') || '';
    
    if (this.documentoId) {
      this.cargarDatos();
    } else {
      this.snackBar.open('ID de documento no válido', 'Cerrar', { duration: 3000 });
      this.volver();
    }
  }

  cargarDatos(): void {
    this.cargando = true;
    
    // Cargar documento
    if (this.documentoId.startsWith('N')) {
      // Si es una notificación, obtenemos el documento del detalle de la notificación
      this.lexnetService.getDetalleNotificacion(this.documentoId.substring(1)).subscribe({
        next: (notificacion) => {
          const documentoEncontrado = notificacion.documentos.find(doc => doc.id === this.documentoId);
          if (documentoEncontrado) {
            this.documento = documentoEncontrado;
            this.formulario.patchValue({
              descripcion: documentoEncontrado.descripcion
            });
          } else {
            this.snackBar.open('Documento no encontrado en la notificación', 'Cerrar', { duration: 3000 });
            this.volver();
          }
        },
        error: (error) => {
          console.error('Error al cargar el documento:', error);
          this.snackBar.open('Error al cargar el documento', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else if (this.documentoId.startsWith('E')) {
      // Si es un escrito, obtenemos el documento del detalle del escrito
      this.lexnetService.getDetalleEscrito(this.documentoId.substring(1)).subscribe({
        next: (escrito) => {
          const documentoEncontrado = escrito.documentos.find(doc => doc.id === this.documentoId);
          if (documentoEncontrado) {
            this.documento = documentoEncontrado;
            this.formulario.patchValue({
              descripcion: documentoEncontrado.descripcion
            });
          } else {
            this.snackBar.open('Documento no encontrado en el escrito', 'Cerrar', { duration: 3000 });
            this.volver();
          }
        },
        error: (error) => {
          console.error('Error al cargar el documento:', error);
          this.snackBar.open('Error al cargar el documento', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else {
      this.snackBar.open('ID de documento no válido', 'Cerrar', { duration: 3000 });
      this.volver();
      return;
    }
    
    // Cargar episodios
    this.episodiosService.getEpisodios().subscribe({
      next: (episodios) => {
        this.episodios = episodios;
        
        if (this.episodioId) {
          this.formulario.patchValue({
            episodioId: this.episodioId
          });
        }
        
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar episodios:', error);
        this.snackBar.open('Error al cargar los episodios', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  agregarDocumento(): void {
    if (!this.formulario.valid) {
      this.snackBar.open('Por favor, complete todos los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (!this.documento) {
      this.snackBar.open('No se ha cargado correctamente el documento', 'Cerrar', { duration: 3000 });
      return;
    }
    
    const episodioSeleccionado = this.formulario.value.episodioId;
    
    this.lexnetService.asociarDocumentoAEpisodio(this.documentoId, episodioSeleccionado).subscribe({
      next: (resultado) => {
        this.snackBar.open('Documento asociado correctamente al episodio', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/episodios/modificar', episodioSeleccionado]);
      },
      error: (error) => {
        console.error('Error al asociar documento:', error);
        this.snackBar.open('Error al asociar el documento al episodio', 'Cerrar', { duration: 3000 });
      }
    });
  }

  volver(): void {
    this.router.navigate(['/lexnet/mensajes-recibidos']);
  }
}