import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

@Component({
  selector: 'app-paso-solicitante',
  templateUrl: './paso-solicitante.component.html',
  styleUrls: ['./paso-solicitante.component.css']
})
export class PasoSolicitanteComponent implements OnInit {
  solicitanteForm!: FormGroup;
  destinatariosDisponibles = [
    'INTCF. Departamento de Madrid',
    'INTCF. Departamento de Barcelona',
    'INTCF. Departamento de Sevilla',
    'INTCF. Departamento de La Laguna'
  ];
  organosDisponibles = [
    'Juzgado de Primera Instancia',
    'Juzgado de Instrucción',
    'Juzgado de lo Penal',
    'Juzgado de Violencia sobre la Mujer'
  ];
  tiposReferenciaDisponibles = [
    'Diligencias Previas',
    'Procedimiento Abreviado',
    'Juicio Rápido',
    'Sumario'
  ];

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    this.solicitanteForm = this.fb.group({
      esProcedimientoJudicial: [datosActuales.esProcedimientoJudicial ?? true],
      destinatario: [datosActuales.destinatario || 'INTCF. Departamento de Madrid', Validators.required],
      organo: [datosActuales.organo || '', Validators.required],
      tipoReferencia: [datosActuales.tipoReferencia || '', Validators.required],
      numero: [datosActuales.numero || '', Validators.required],
      referenciaRemitente: [datosActuales.referenciaRemitente || ''],
      responsableSolicitud: [datosActuales.responsableSolicitud || '']
    });

    // Suscribirse a cambios en el formulario para actualizar el servicio
    this.solicitanteForm.valueChanges.subscribe(valores => {
      this.remisionService.actualizarDatos(valores);
    });
  }
}