import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RemisionMuestrasService } from '../../../../services/remision-muestras.service';

@Component({
  selector: 'app-paso-custodia',
  templateUrl: './paso-custodia.component.html',
  styleUrls: ['./paso-custodia.component.css']
})
export class PasoCustodiaComponent implements OnInit {
  custodiaForm!: FormGroup;
  registrosCustodia: any[] = [];
  
  displayedColumns = ['nombre', 'actividad', 'fecha', 'acciones'];

  constructor(
    private fb: FormBuilder,
    private remisionService: RemisionMuestrasService
  ) {}

  ngOnInit(): void {
    const datosActuales = this.remisionService.datosInforme;
    
    // Inicializar formulario
    this.custodiaForm = this.fb.group({
      nombreDocumento: ['', Validators.required],
      organismoActividad: ['', Validators.required],
      fecha: [new Date(), Validators.required]
    });

    // Cargar registros ya añadidos
    this.registrosCustodia = datosActuales.cadenaCustodia || [];
  }

  agregarRegistro(): void {
    if (this.custodiaForm.valid) {
      const nuevoRegistro = { ...this.custodiaForm.value };
      this.registrosCustodia.push(nuevoRegistro);
      this.remisionService.actualizarDatos({
        cadenaCustodia: this.registrosCustodia
      });
      
      // Limpiar formulario
      this.custodiaForm.reset({
        fecha: new Date()
      });
    }
  }

  eliminarRegistro(index: number): void {
    this.registrosCustodia.splice(index, 1);
    this.remisionService.actualizarDatos({
      cadenaCustodia: this.registrosCustodia
    });
  }
}