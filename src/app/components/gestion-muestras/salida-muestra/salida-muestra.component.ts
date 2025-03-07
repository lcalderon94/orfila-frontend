// salida-muestra.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MuestrasService, Localizacion, Muestra } from 'src/app/services/muestras.service';

@Component({
  selector: 'app-salida-muestra',
  templateUrl: './salida-muestra.component.html',
  styleUrls: ['./salida-muestra.component.css']
})
export class SalidaMuestraComponent implements OnInit {
  registroForm: FormGroup;
  localizacionSeleccionada: Localizacion | null = null;
  localizaciones: Localizacion[] = [];
  muestrasLeidas: any[] = [];
  localizacionId: number | null = null;
  usarPredeterminada = false;
  tiempoEspera = 200; // ms para esperar entre lectura de códigos

  constructor(
    private fb: FormBuilder,
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      localizacionId: ['', Validators.required],
      codigoBarrasMuestra: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Comprobar si se ha pasado un ID de localización por la ruta
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.localizacionId = +id;
        this.cargarLocalizacion(this.localizacionId);
      } else {
        this.cargarLocalizacionesExternas();
      }
    });
    
    // Escuchar cambios en el campo de código de barras para procesar la lectura automáticamente
    this.registroForm.get('codigoBarrasMuestra')?.valueChanges.subscribe(value => {
      if (value && value.length > 10) { // Un código de barras típico tiene más de 10 caracteres
        // Esperar un pequeño tiempo para asegurarse de que la lectura está completa
        setTimeout(() => {
          this.registrarMuestra();
        }, this.tiempoEspera);
      }
    });
  }

  private cargarLocalizacion(id: number) {
    this.muestrasService.getLocalizacion(id).subscribe(
      localizacion => {
        if (localizacion && localizacion.tipoLocalizacion === 'externa') {
          this.localizacionSeleccionada = localizacion;
          this.registroForm.patchValue({
            localizacionId: localizacion.id
          });
          this.usarPredeterminada = true;
        } else {
          this.snackBar.open('La localización seleccionada no es válida para salida de muestras', 'Cerrar', {
            duration: 3000
          });
          this.cargarLocalizacionesExternas();
        }
      },
      error => {
        this.snackBar.open('Error al cargar la localización', 'Cerrar', {
          duration: 3000
        });
        this.cargarLocalizacionesExternas();
      }
    );
  }

  private cargarLocalizacionesExternas() {
    this.muestrasService.getLocalizaciones({ tipoLocalizacion: 'externa' }).subscribe(
      localizaciones => {
        this.localizaciones = localizaciones;
        
        const predeterminada = localizaciones.find(loc => {
          const pd = loc.porDefecto;
          if (typeof pd === 'string') {
            // Se convierte a minúsculas y se compara con 'true'
            return pd.toLowerCase() === 'true';
          }
          // Si es booleano, se compara directamente
          return pd === true;
        });
        
        if (predeterminada) {
          this.localizacionSeleccionada = predeterminada;
          this.registroForm.patchValue({
            localizacionId: predeterminada.id
          });
          this.usarPredeterminada = true;
        }
      }
    );
  }
  
  


  onLocalizacionChange(event: any) {
    const locId = event.value;
    const localizacion = this.localizaciones.find(loc => loc.id === locId);
    if (localizacion) {
      this.localizacionSeleccionada = localizacion;
    }
  }

  registrarMuestra() {
    if (this.registroForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos obligatorios', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const formValue = this.registroForm.value;
    const codigoBarrasMuestra = formValue.codigoBarrasMuestra;
    
    // Validar que el código de barras tenga un formato válido
    if (!this.validarCodigoBarrasMuestra(codigoBarrasMuestra)) {
      this.snackBar.open('El código de barras de la muestra no tiene un formato válido', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // Verificar si la muestra existe en el sistema
    // En una implementación real, esto sería una llamada al servicio
    
    // Crear objeto de muestra para guardar
    const nuevaMuestra: Muestra = {
      codigoBarras: codigoBarrasMuestra,
      fechaRegistro: new Date(),
      usuario: 'usuario_actual', // En una implementación real se obtendría del servicio de autenticación
      localizacion: this.localizacionSeleccionada as Localizacion
    };

    // En una implementación real, esto sería una llamada al servicio
    // Aquí simulamos la respuesta exitosa
    // this.muestrasService.registrarMuestra(nuevaMuestra).subscribe(...)

    // Añadir la muestra al listado visual
    this.muestrasLeidas.unshift({
      codigoBarrasLocalizacion: this.localizacionSeleccionada?.codigoBarras,
      descripcionLocalizacion: this.localizacionSeleccionada?.descripcionLocalizacion,
      fechaRegistro: new Date(),
      codigoBarrasMuestra: codigoBarrasMuestra,
      usuario: 'usuario_actual'
    });

    // Limpiar el campo de código de barras para la siguiente lectura
    this.registroForm.patchValue({
      codigoBarrasMuestra: ''
    });

    // Enfocar el campo de código de barras para la siguiente lectura
    document.getElementById('codigoBarrasMuestraInput')?.focus();
  }

  eliminarRegistro(index: number) {
    if (confirm('¿Está seguro de eliminar este registro?')) {
      this.muestrasLeidas.splice(index, 1);
    }
  }

  guardar() {
    if (this.muestrasLeidas.length === 0) {
      this.snackBar.open('No hay muestras para guardar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    // En una implementación real, esto sería una llamada al servicio para guardar todas las muestras
    this.snackBar.open(`${this.muestrasLeidas.length} muestras registradas para salida correctamente`, 'Cerrar', {
      duration: 3000
    });

    // Limpiar el listado después de guardar
    this.muestrasLeidas = [];
  }

  toggleUsarPredeterminada() {
    this.usarPredeterminada = !this.usarPredeterminada;
    
    if (!this.usarPredeterminada) {
      this.registroForm.patchValue({
        localizacionId: ''
      });
      this.localizacionSeleccionada = null;
    }
  }

  private validarCodigoBarrasMuestra(codigo: string): boolean {
    return !!codigo && codigo.length >= 10;
  }
  

  volver() {
    this.router.navigate(['/gestion-muestras/localizaciones']);
  }
}