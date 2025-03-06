import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

@Component({
  selector: 'app-paso-muestras',
  templateUrl: './paso-muestras.component.html',
  styleUrls: ['./paso-muestras.component.css']
})
export class PasoMuestrasComponent implements OnInit {
  muestraForm!: FormGroup;
  muestras: any[] = [];
  
  tiposMuestra1 = ['Sangre', 'Orina', 'Pelo', 'Uña', 'Tejido'];
  tiposMuestra2: string[] = [];
  tiposMuestra3: string[] = [];

  displayedColumns = ['identificacion', 'tipo', 'conservante', 'fechas', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    // Inicializar formulario
    this.muestraForm = this.fb.group({
      identificacion: ['', Validators.required],
      conservante: [''],
      fechaExtraccion: [null],
      fechaDestruccion: [null],
      descripcion: [''],
      tipoMuestra1: ['', Validators.required],
      tipoMuestra2: [''],
      tipoMuestra3: ['']
    });

    // Cargar muestras ya añadidas
    this.muestras = datosActuales.muestras || [];

    // Agregar listeners para cargar tipos de muestra dependientes
    this.muestraForm.get('tipoMuestra1')?.valueChanges.subscribe(tipo1 => {
      this.cargarTiposMuestra2(tipo1);
      this.muestraForm.get('tipoMuestra2')?.setValue('');
      this.muestraForm.get('tipoMuestra3')?.setValue('');
    });

    this.muestraForm.get('tipoMuestra2')?.valueChanges.subscribe(tipo2 => {
      this.cargarTiposMuestra3(tipo2);
      this.muestraForm.get('tipoMuestra3')?.setValue('');
    });
  }

  cargarTiposMuestra2(tipo1: string): void {
    // En una implementación real, se cargarían desde un servicio
    // Aquí los estamos hardcodeando para el ejemplo
    if (tipo1 === 'Sangre') {
      this.tiposMuestra2 = ['Venosa', 'Arterial', 'Capilar'];
    } else if (tipo1 === 'Pelo') {
      this.tiposMuestra2 = ['Cabeza', 'Vello axilar', 'Vello púbico'];
    } else if (tipo1 === 'Tejido') {
      this.tiposMuestra2 = ['Muscular', 'Hepático', 'Cerebral', 'Pulmonar'];
    } else {
      this.tiposMuestra2 = [];
    }
  }

  cargarTiposMuestra3(tipo2: string): void {
    // En una implementación real, se cargarían desde un servicio
    // Aquí los estamos hardcodeando para el ejemplo
    if (tipo2 === 'Venosa') {
      this.tiposMuestra3 = ['Con anticoagulante', 'Sin anticoagulante'];
    } else if (tipo2 === 'Muscular') {
      this.tiposMuestra3 = ['Bíceps', 'Cuádriceps', 'Pectoral'];
    } else {
      this.tiposMuestra3 = [];
    }
  }

  agregarMuestra(): void {
    if (this.muestraForm.valid) {
      const nuevaMuestra = { ...this.muestraForm.value };
      this.muestras.push(nuevaMuestra);
      this.remisionService.actualizarDatos({
        muestras: this.muestras
      });
      
      // Limpiar formulario
      this.muestraForm.reset();
    }
  }

  eliminarMuestra(index: number): void {
    this.muestras.splice(index, 1);
    this.remisionService.actualizarDatos({
      muestras: this.muestras
    });
  }

  obtenerDescripcionTipoMuestra(muestra: any): string {
    let descripcion = muestra.tipoMuestra1 || '';
    
    if (muestra.tipoMuestra2) {
      descripcion += ' > ' + muestra.tipoMuestra2;
    }
    
    if (muestra.tipoMuestra3) {
      descripcion += ' > ' + muestra.tipoMuestra3;
    }
    
    return descripcion;
  }
}