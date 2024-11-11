import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-nueva-localizacion',
  templateUrl: './nueva-localizacion.component.html',
  styleUrls: ['./nueva-localizacion.component.css']
})
export class NuevaLocalizacionComponent implements OnInit {
  localizacionForm: FormGroup;
  codigoBarrasSVG: SafeHtml = '';

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.localizacionForm = this.fb.group({
      etiquetaLocalizacion: [{value: 'LI', disabled: true}],
      sedeCP: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      plantaEdificio: ['000'],
      numeroIncremental: [{value: '0188', disabled: true}],
      descripcion: ['', [Validators.required, Validators.maxLength(1000)]]
    });

    // Escuchar cambios en los campos relevantes
    this.localizacionForm.valueChanges.subscribe(() => {
      this.actualizarCodigoBarras();
    });
  }

  ngOnInit() {
    this.actualizarCodigoBarras();
  }

  private actualizarCodigoBarras() {
    const formValue = this.localizacionForm.getRawValue();
    const codigo = `${formValue.etiquetaLocalizacion}${formValue.sedeCP}${formValue.plantaEdificio}${formValue.numeroIncremental}`;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    
    try {
      JsBarcode(svg, codigo, {
        format: "CODE128",
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
              }
              .codigo-container {
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="codigo-container">
              ${this.codigoBarrasSVG}
            </div>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.print();
    }
  }

  private contarCaracteres(event: any, maxLength: number) {
    const input = event.target as HTMLTextAreaElement;
    const count = input.value.length;
    if (count > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }

  volver() {
    // Implementar navegación de vuelta
    console.log('Volver a la página anterior');
  }

  guardar() {
    if (this.localizacionForm.valid) {
      const formValue = this.localizacionForm.getRawValue();
      console.log('Guardando localización:', formValue);
      // Aquí iría la llamada al servicio para guardar
    }
  }

  limpiarFormulario() {
    this.localizacionForm.reset({
      etiquetaLocalizacion: 'LI',
      plantaEdificio: '000',
      numeroIncremental: '0188'
    });
  }

  // Getters para facilitar la validación en el template
  get sedeCPInvalido() {
    const control = this.localizacionForm.get('sedeCP');
    return control?.invalid && (control?.dirty || control?.touched);
  }

  get descripcionInvalida() {
    const control = this.localizacionForm.get('descripcion');
    return control?.invalid && (control?.dirty || control?.touched);
  }
}