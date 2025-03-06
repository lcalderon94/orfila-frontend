// paso-basicos.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

// Añadir esta interfaz para definir la estructura de Sujeto
interface SujetoDisponible {
  id: number;
  nombre: string;
  expediente: string;
}

@Component({
  selector: 'app-paso-basicos',
  templateUrl: './paso-basicos.component.html',
  styleUrls: ['./paso-basicos.component.css']
})
export class PasoBasicosComponent implements OnInit {
  basicosForm!: FormGroup;
  categoriasDisponibles = [
    'Informes Medico-Legales', 
    'Informes Periciales', 
    'Remisión de Muestras'
  ];
  tiposDisponibles = [
    'Informe de Remisión de Muestras al INTCF'
  ];
  // Corregir la definición con el tipo adecuado
  sujetosDisponibles: SujetoDisponible[] = []; 

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    this.basicosForm = this.fb.group({
      categoria: [datosActuales.categoria || 'Remisión de Muestras', Validators.required],
      tipo: [datosActuales.tipo || 'Informe de Remisión de Muestras al INTCF', Validators.required],
      nombre: [datosActuales.nombre || this.generarNombreInforme(), Validators.required],
      sujeto: [datosActuales.sujeto]
    });

    this.cargarSujetos();

    this.basicosForm.valueChanges.subscribe(valores => {
      this.remisionService.actualizarDatos(valores);
    });
  }

  private generarNombreInforme(): string {
    const fecha = new Date();
    const timestamp = fecha.getTime();
    return `InformeRemision_${timestamp}`;
  }

  private cargarSujetos(): void {
    // Ahora definimos correctamente el tipo de los objetos en el array
    this.sujetosDisponibles = [
      { id: 1, nombre: 'Juan Pérez García', expediente: 'EX2022001' },
      { id: 2, nombre: 'María López Martínez', expediente: 'EX2022002' }
    ];
  }
}