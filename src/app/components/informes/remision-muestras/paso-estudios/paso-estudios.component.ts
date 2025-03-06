import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

@Component({
  selector: 'app-paso-estudios',
  templateUrl: './paso-estudios.component.html',
  styleUrls: ['./paso-estudios.component.css']
})
export class PasoEstudiosComponent implements OnInit {
  estudiosForm!: FormGroup;
  tiposAsunto = [
    'Autopsia Judicial',
    'Filiación',
    'Delito contra la libertad sexual',
    'Estudio toxicológico'
  ];
  tiposEstudio = [
    'Histopatológico',
    'Toxicológico',
    'Biológico',
    'Antropológico'
  ];
  tiposProcedimiento = [
    'Diligencias Previas',
    'Procedimiento Abreviado',
    'Juicio Rápido'
  ];
  
  asuntosSeleccionados: string[] = [];
  estudiosSeleccionados: string[] = [];

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    this.estudiosForm = this.fb.group({
      tipoAsunto: [datosActuales.tipoAsunto || '', Validators.required],
      tipoEstudio: [datosActuales.tipoEstudio || '', Validators.required],
      tipoProcedimiento: [datosActuales.tipoProcedimiento || '', Validators.required]
    });

    // Cargar datos existentes
    this.asuntosSeleccionados = datosActuales.asuntos || [];
    this.estudiosSeleccionados = datosActuales.estudios || [];

    // Suscribirse a cambios en el formulario para actualizar el servicio
    this.estudiosForm.valueChanges.subscribe(valores => {
      this.remisionService.actualizarDatos({
        tipoAsunto: valores.tipoAsunto,
        tipoEstudio: valores.tipoEstudio,
        tipoProcedimiento: valores.tipoProcedimiento
      });
    });
  }

  agregarAsunto(): void {
    const tipoAsunto = this.estudiosForm.get('tipoAsunto')?.value;
    if (tipoAsunto && !this.asuntosSeleccionados.includes(tipoAsunto)) {
      this.asuntosSeleccionados.push(tipoAsunto);
      this.remisionService.actualizarDatos({
        asuntos: this.asuntosSeleccionados
      });
    }
  }

  removerAsunto(asunto: string): void {
    this.asuntosSeleccionados = this.asuntosSeleccionados.filter(a => a !== asunto);
    this.remisionService.actualizarDatos({
      asuntos: this.asuntosSeleccionados
    });
  }

  agregarEstudio(): void {
    const tipoEstudio = this.estudiosForm.get('tipoEstudio')?.value;
    if (tipoEstudio && !this.estudiosSeleccionados.includes(tipoEstudio)) {
      this.estudiosSeleccionados.push(tipoEstudio);
      this.remisionService.actualizarDatos({
        estudios: this.estudiosSeleccionados
      });
    }
  }

  removerEstudio(estudio: string): void {
    this.estudiosSeleccionados = this.estudiosSeleccionados.filter(e => e !== estudio);
    this.remisionService.actualizarDatos({
      estudios: this.estudiosSeleccionados
    });
  }
}