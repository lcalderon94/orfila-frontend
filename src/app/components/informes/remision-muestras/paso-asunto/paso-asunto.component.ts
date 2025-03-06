import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

@Component({
  selector: 'app-paso-asunto',
  templateUrl: './paso-asunto.component.html',
  styleUrls: ['./paso-asunto.component.css']
})
export class PasoAsuntoComponent implements OnInit {
  asuntoForm!: FormGroup;
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    this.asuntoForm = this.fb.group({
      asuntoContenido: [datosActuales.asuntoContenido || '', Validators.required],
      incluirSeccion: [true]
    });

    // Suscribirse a cambios en el formulario para actualizar el servicio
    this.asuntoForm.valueChanges.subscribe(valores => {
      this.remisionService.actualizarDatos({
        asuntoContenido: valores.asuntoContenido
      });
    });
  }
}