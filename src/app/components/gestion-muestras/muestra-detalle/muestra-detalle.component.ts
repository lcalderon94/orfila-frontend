import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MuestrasService, Muestra } from '../../../services/muestras.service';

@Component({
  selector: 'app-muestra-detalle',
  templateUrl: './muestra-detalle.component.html',
  styleUrls: ['./muestra-detalle.component.css']
})
export class MuestraDetalleComponent implements OnInit {
  muestraId: number | null = null;
  muestra: Muestra | null = null;
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.muestraId = +id;
        this.cargarMuestra(this.muestraId);
      } else {
        this.snackBar.open('ID de muestra no especificado', 'Cerrar', {
          duration: 3000
        });
        this.volver();
      }
    });
  }

  private cargarMuestra(id: number) {
    this.muestrasService.getMuestra(id).subscribe(
      muestra => {
        if (muestra && muestra.id) {
          this.muestra = muestra;
          
          // Cargar imagen si existe
          if (muestra.imagen) {
            this.imagenPreview = muestra.imagen;
          }
        } else {
          this.snackBar.open('La muestra no existe o no tiene ID', 'Cerrar', {
            duration: 3000
          });
          this.volver();
        }
      },
      error => {
        this.snackBar.open('Error al cargar la muestra', 'Cerrar', {
          duration: 3000
        });
        this.volver();
      }
    );
  }

  activarInputFile() {
    document.getElementById('upload-image')?.click();
  }

  onArchivoSeleccionado(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.imagenSeleccionada = files[0];
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      
      // Comprobar que imagenSeleccionada no es null antes de leer
      if (this.imagenSeleccionada) {
        reader.readAsDataURL(this.imagenSeleccionada);
      }
    }
  }

  guardar() {
    if (!this.muestra || !this.muestra.id) {
      return;
    }
    
    // Crear objeto actualizado con manejo de valores null
    const muestraActualizada: Muestra = {
      ...this.muestra,
      imagen: this.imagenPreview || undefined // Usar undefined en lugar de null
    };
    
    this.muestrasService.actualizarMuestra(muestraActualizada).subscribe(
      resultado => {
        this.snackBar.open('Muestra actualizada correctamente', 'Cerrar', {
          duration: 3000
        });
      },
      error => {
        this.snackBar.open('Error al actualizar la muestra', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  irAlEpisodio() {
    if (this.muestra && this.muestra.episodioId) {
      this.router.navigate(['/episodios', this.muestra.episodioId]);
    } else {
      this.snackBar.open('No hay episodio asociado a esta muestra', 'Cerrar', {
        duration: 3000
      });
    }
  }

  irAlSujeto() {
    if (this.muestra && this.muestra.sujetoId) {
      this.router.navigate(['/sujetos', this.muestra.sujetoId]);
    } else {
      this.snackBar.open('No hay sujeto asociado a esta muestra', 'Cerrar', {
        duration: 3000
      });
    }
  }

  volver() {
    this.router.navigate(['/gestion-muestras/muestras-list']);
  }
}