// nueva-localizacion.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MuestrasService, Localizacion } from 'src/app/services/muestras.service';
import * as JsBarcode from 'jsbarcode';


@Component({
  selector: 'app-nueva-localizacion',
  templateUrl: './nueva-localizacion.component.html',
  styleUrls: ['./nueva-localizacion.component.css']
})
export class NuevaLocalizacionComponent implements OnInit {
  localizacionForm: FormGroup;
  codigoBarrasSVG: SafeHtml = '';
  modoEdicion = false;
  localizacionId: number | null = null;
  tituloComponente = 'Nueva Localización';
  
  // Para el manejo de muestras
  muestrasAsociadas: any[] = [];
  mostrarMuestras = false;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private muestrasService: MuestrasService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.localizacionForm = this.fb.group({
      tipoLocalizacion: ['local', Validators.required],
      etiquetaLocalizacion: [{value: 'LI', disabled: true}],
      sedeCP: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      plantaEdificio: ['000'],
      numeroIncremental: [{value: '', disabled: true}],
      descripcionLocalizacion: ['', [Validators.required, Validators.maxLength(1000)]],
      porDefecto: [false]
    });

    // Escuchar cambios en tipo de localización
    this.localizacionForm.get('tipoLocalizacion')?.valueChanges.subscribe(tipo => {
      const etiquetaControl = this.localizacionForm.get('etiquetaLocalizacion');
      const plantaControl = this.localizacionForm.get('plantaEdificio');
      
      if (tipo === 'local') {
        etiquetaControl?.setValue('LI');
        plantaControl?.enable();
      } else {
        etiquetaControl?.setValue('LE');
        plantaControl?.disable();
        plantaControl?.setValue('');
      }
      
      this.actualizarCodigoBarras();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.localizacionId = +id;
        this.modoEdicion = true;
        this.tituloComponente = 'Modificar Localización';
        this.cargarLocalizacion(this.localizacionId);
      } else {
        this.obtenerSiguienteNumeroIncremental();
      }
    });
  }

  private cargarLocalizacion(id: number) {
    this.muestrasService.getLocalizacion(id).subscribe(
      localizacion => {
        if (localizacion) {
          // Actualizar valores del formulario
          this.localizacionForm.patchValue({
            tipoLocalizacion: localizacion.tipoLocalizacion,
            etiquetaLocalizacion: localizacion.etiquetaLocalizacion,
            sedeCP: localizacion.sedeCP,
            plantaEdificio: localizacion.plantaEdificio || '',
            numeroIncremental: localizacion.numeroIncremental,
            descripcionLocalizacion: localizacion.descripcionLocalizacion,
            porDefecto: localizacion.porDefecto || false
          });
          
          this.actualizarCodigoBarras();
          
          // Obtener muestras asociadas si estamos en modo edición
          this.cargarMuestrasAsociadas(id);
        }
      },
      error => {
        this.snackBar.open('Error al cargar la localización', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  private cargarMuestrasAsociadas(id: number) {
    this.muestrasService.getMuestrasPorLocalizacion(id).subscribe(
      muestras => {
        this.muestrasAsociadas = muestras;
      }
    );
  }

  private obtenerSiguienteNumeroIncremental() {
    // En una implementación real, se obtendría del servicio
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    this.localizacionForm.get('numeroIncremental')?.setValue(numeroAleatorio.toString());
    this.actualizarCodigoBarras();
  }

  private actualizarCodigoBarras() {
    const formValue = this.localizacionForm.getRawValue();
    const codigoPartes = [
      formValue.etiquetaLocalizacion,
      formValue.sedeCP,
      formValue.tipoLocalizacion === 'local' ? formValue.plantaEdificio : '',
      formValue.numeroIncremental
    ];
    
    const codigo = codigoPartes.join('');
    
    if (!codigo || codigo.includes('undefined') || codigo.includes('null')) {
      return;
    }
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    try {
      JsBarcode(svg, codigo, {
        format: "CODE39",
        width: 2,
        height: 100,
        displayValue: true,
        text: codigo,
        fontSize: 20,
        margin: 10,
        background: "#ffffff"
      });

      this.codigoBarrasSVG = this.sanitizer.bypassSecurityTrustHtml(svg.outerHTML);
    } catch (error) {
      console.error('Error al generar el código de barras:', error);
    }
  }

  imprimirCodigo() {
    const ventanaImpresion = window.open('', '_blank');
    if (ventanaImpresion) {
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Imprimir Código de Barras</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
              }
              .codigo-container {
                text-align: center;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
              }
              .descripcion {
                margin-top: 20px;
                font-size: 16px;
                max-width: 300px;
                word-wrap: break-word;
              }
            </style>
          </head>
          <body>
            <div class="codigo-container">
              ${this.codigoBarrasSVG}
              <div class="descripcion">
                ${this.localizacionForm.get('descripcionLocalizacion')?.value || 'Sin descripción'}
              </div>
            </div>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);
    }
  }

  guardar() {
    if (this.localizacionForm.invalid) {
      this.snackBar.open('Por favor, complete todos los campos obligatorios correctamente', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    const formValue = this.localizacionForm.getRawValue();
    const localizacion: Localizacion = {
      id: this.localizacionId || undefined,
      tipoLocalizacion: formValue.tipoLocalizacion,
      etiquetaLocalizacion: formValue.etiquetaLocalizacion,
      sedeCP: formValue.sedeCP,
      plantaEdificio: formValue.tipoLocalizacion === 'local' ? formValue.plantaEdificio : undefined,
      numeroIncremental: formValue.numeroIncremental,
      descripcionLocalizacion: formValue.descripcionLocalizacion,
      codigoBarras: this.muestrasService.generarCodigoBarrasLocalizacion(formValue),
      porDefecto: formValue.porDefecto
    };

    const observable = this.modoEdicion 
      ? this.muestrasService.actualizarLocalizacion(localizacion)
      : this.muestrasService.crearLocalizacion(localizacion);

    observable.subscribe(
      resultado => {
        this.snackBar.open(
          this.modoEdicion ? 'Localización actualizada correctamente' : 'Localización creada correctamente', 
          'Cerrar', 
          { duration: 3000 }
        );
        
        if (!this.modoEdicion) {
          // Preguntar si desea crear otra localización
          if (confirm('¿Desea crear otra localización?')) {
            this.limpiarFormulario();
            this.obtenerSiguienteNumeroIncremental();
          } else {
            this.router.navigate(['/gestion-muestras/localizaciones']);
          }
        }
      },
      error => {
        this.snackBar.open('Error al guardar la localización', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  limpiarFormulario() {
    const tipoActual = this.localizacionForm.get('tipoLocalizacion')?.value;
    this.localizacionForm.reset({
      tipoLocalizacion: tipoActual,
      etiquetaLocalizacion: tipoActual === 'local' ? 'LI' : 'LE',
      plantaEdificio: tipoActual === 'local' ? '000' : '',
      porDefecto: false
    });
  }

  toggleMuestrasAsociadas() {
    this.mostrarMuestras = !this.mostrarMuestras;
  }

  insertarMuestras() {
    if (this.modoEdicion && this.localizacionId) {
      const tipoLocalizacion = this.localizacionForm.get('tipoLocalizacion')?.value;
      if (tipoLocalizacion === 'local') {
        this.router.navigate(['/gestion-muestras/registro-muestras', this.localizacionId]);
      } else {
        this.router.navigate(['/gestion-muestras/salida-muestra', this.localizacionId]);
      }
    } else {
      this.snackBar.open('Primero debe guardar la localización', 'Cerrar', {
        duration: 3000
      });
    }
  }

  volver() {
    this.router.navigate(['/gestion-muestras/localizaciones']);
  }
}