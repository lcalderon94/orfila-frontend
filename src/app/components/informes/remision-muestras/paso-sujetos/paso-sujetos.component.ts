import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

interface Sujeto {
  id: number;
  nombre: string;
  expediente: string;
}

@Component({
  selector: 'app-paso-sujetos',
  templateUrl: './paso-sujetos.component.html',
  styleUrls: ['./paso-sujetos.component.css']
})
export class PasoSujetosComponent implements OnInit {
  sujetos: Sujeto[] = []; // Se cargaría desde un servicio
  sujetoForm!: FormGroup;
  sujetosEstudioList: any[] = [];
  
  // Campos condicionales
  mostrarCampoAccidente = false;
  mostrarCamposFiliacion = false;
  mostrarCamposDelito = false;

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    // Inicializar formulario
    this.sujetoForm = this.fb.group({
      sujeto: ['', Validators.required],
      esAccidente: [false],
      lugarAccidente: [''],
      fechaAccidente: [null],
      esFiliacion: [false],
      objetoFiliacion: [''],
      personaFiliacion: [''],
      esDelitoSexual: [false],
      fechaDelito: [null],
      lugarDelito: [''],
      descripcionDelito: ['']
    });

    // Cargar sujetos para seleccionar
    this.cargarSujetos();
    
    // Cargar sujetos ya añadidos
    this.sujetosEstudioList = datosActuales.sujetosEstudio || [];

    // Agregar listeners para campos condicionales
    this.sujetoForm.get('esAccidente')?.valueChanges.subscribe(value => {
      this.mostrarCampoAccidente = value;
    });

    this.sujetoForm.get('esFiliacion')?.valueChanges.subscribe(value => {
      this.mostrarCamposFiliacion = value;
    });

    this.sujetoForm.get('esDelitoSexual')?.valueChanges.subscribe(value => {
      this.mostrarCamposDelito = value;
    });
  }

  cargarSujetos(): void {
    // En una implementación real, se cargarían desde un servicio
    this.sujetos = [
      { id: 1, nombre: 'Juan Pérez García', expediente: 'EX2022001' },
      { id: 2, nombre: 'María López Martínez', expediente: 'EX2022002' }
    ];
  }

  incluirSujeto(): void {
    if (this.sujetoForm.valid) {
      const formValues = this.sujetoForm.value;
      const sujetoSeleccionado = this.sujetos.find(s => s.id === formValues.sujeto);
      
      if (sujetoSeleccionado) {
        const nuevoSujetoEstudio = {
          sujeto: sujetoSeleccionado,
          datos: {
            esAccidente: formValues.esAccidente,
            lugarAccidente: formValues.lugarAccidente,
            fechaAccidente: formValues.fechaAccidente,
            esFiliacion: formValues.esFiliacion,
            objetoFiliacion: formValues.objetoFiliacion,
            personaFiliacion: formValues.personaFiliacion,
            esDelitoSexual: formValues.esDelitoSexual,
            fechaDelito: formValues.fechaDelito,
            lugarDelito: formValues.lugarDelito,
            descripcionDelito: formValues.descripcionDelito
          }
        };
        
        this.sujetosEstudioList.push(nuevoSujetoEstudio);
        this.remisionService.actualizarDatos({
          sujetosEstudio: this.sujetosEstudioList
        });
        
        // Limpiar formulario
        this.sujetoForm.reset({
          esAccidente: false,
          esFiliacion: false,
          esDelitoSexual: false
        });
      }
    }
  }

  eliminarSujeto(index: number): void {
    this.sujetosEstudioList.splice(index, 1);
    this.remisionService.actualizarDatos({
      sujetosEstudio: this.sujetosEstudioList
    });
  }
}