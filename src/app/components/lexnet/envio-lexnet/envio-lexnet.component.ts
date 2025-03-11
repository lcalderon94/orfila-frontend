// envio-lexnet.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LexnetService, DocumentoLexnet, EnvioLexnet } from 'src/app/services/lexnet.service';
import { EpisodiosService } from 'src/app/services/episodio.service';

@Component({
  selector: 'app-envio-lexnet',
  templateUrl: './envio-lexnet.component.html',
  styleUrls: ['./envio-lexnet.component.css']
})
export class EnvioLexnetComponent implements OnInit {
  episodioId: string = '';
  formEnvio: FormGroup;
  documentosDisponibles: DocumentoLexnet[] = [];
  documentoPrincipal: string = '';
  documentosAdjuntos: string[] = [];
  cargando: boolean = true;
  enviando: boolean = false;
  episodioDetalle: any = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private lexnetService: LexnetService,
    private episodiosService: EpisodiosService
  ) {
    this.formEnvio = this.fb.group({
      descripcion: ['', Validators.required],
      tipoDocumento: ['INFORME', Validators.required],
      subtipoDocumento: ['INFORME', Validators.required],
      urgente: [false],
      observaciones: ['', Validators.maxLength(200)]
    });
  }

  ngOnInit(): void {
    this.episodioId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.episodioId) {
      this.cargarDatos();
    } else {
      this.snackBar.open('ID de episodio no válido', 'Cerrar', { duration: 3000 });
      this.volver();
    }
  }

  cargarDatos(): void {
    this.cargando = true;
    
    // Cargar detalles del episodio
    this.episodiosService.getEpisodioById(this.episodioId).subscribe({
      next: (episodio) => {
        if (episodio) {
          this.episodioDetalle = episodio;
          
          // Una vez cargado el episodio, cargar los documentos disponibles
          this.lexnetService.getDocumentosDisponiblesEpisodio(this.episodioId).subscribe({
            next: (documentos) => {
              this.documentosDisponibles = documentos;
              this.cargando = false;
            },
            error: (error) => {
              console.error('Error al cargar documentos:', error);
              this.snackBar.open('Error al cargar los documentos disponibles', 'Cerrar', { duration: 3000 });
              this.cargando = false;
            }
          });
        } else {
          this.snackBar.open('Episodio no encontrado', 'Cerrar', { duration: 3000 });
          this.volver();
        }
      },
      error: (error) => {
        console.error('Error al cargar episodio:', error);
        this.snackBar.open('Error al cargar el episodio', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  onSeleccionPrincipal(documentoId: string): void {
    this.documentoPrincipal = documentoId;
    
    // Eliminar de adjuntos si estaba seleccionado
    const index = this.documentosAdjuntos.indexOf(documentoId);
    if (index !== -1) {
      this.documentosAdjuntos.splice(index, 1);
    }
  }

  onSeleccionAdjunto(event: MatCheckboxChange, documentoId: string): void {
    if (event.checked) {
      // Si se está seleccionando como adjunto
      if (documentoId === this.documentoPrincipal) {
        // Si ya era el principal, quitarlo como principal
        this.documentoPrincipal = '';
      }
      
      // Añadirlo a adjuntos si no estaba ya
      if (!this.documentosAdjuntos.includes(documentoId)) {
        this.documentosAdjuntos.push(documentoId);
      }
    } else {
      // Si se está deseleccionando, quitarlo de adjuntos
      const index = this.documentosAdjuntos.indexOf(documentoId);
      if (index !== -1) {
        this.documentosAdjuntos.splice(index, 1);
      }
    }
  }

  enviarALexnet(): void {
    if (!this.documentoPrincipal) {
      this.snackBar.open('Debe seleccionar un documento principal', 'Cerrar', { duration: 3000 });
      return;
    }
    
    if (!this.formEnvio.valid) {
      this.snackBar.open('Por favor, complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
      return;
    }
    
    this.enviando = true;
    
    const envio: EnvioLexnet = {
      episodioId: this.episodioId,
      descripcion: this.formEnvio.value.descripcion,
      tipoDocumento: this.formEnvio.value.tipoDocumento,
      subtipoDocumento: this.formEnvio.value.subtipoDocumento,
      urgente: this.formEnvio.value.urgente,
      observaciones: this.formEnvio.value.observaciones,
      documentoPrincipal: this.documentoPrincipal,
      documentosAdjuntos: this.documentosAdjuntos
    };
    
    this.lexnetService.enviarALexnet(envio).subscribe({
      next: (resultado) => {
        this.snackBar.open('Envío realizado correctamente', 'Cerrar', { duration: 3000 });
        this.enviando = false;
        this.router.navigate(['/lexnet/estado-envios']);
      },
      error: (error) => {
        console.error('Error al enviar a LexNET:', error);
        this.snackBar.open('Error al enviar a LexNET', 'Cerrar', { duration: 3000 });
        this.enviando = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/episodios/modificar', this.episodioId]);
  }

  esDocumentoPrincipal(documentoId: string): boolean {
    return this.documentoPrincipal === documentoId;
  }

  esDocumentoAdjunto(documentoId: string): boolean {
    return this.documentosAdjuntos.includes(documentoId);
  }
}