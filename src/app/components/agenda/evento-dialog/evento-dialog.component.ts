import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evento } from '../../../services/agenda.service';

@Component({
  selector: 'app-evento-dialog',
  templateUrl: './evento-dialog.component.html',
  styleUrls: ['./evento-dialog.component.css']
})
export class EventoDialogComponent {
  eventoForm: FormGroup;
  modoEdicion: boolean;
  esNuevo: boolean;
  esCitacionJuicio: boolean;
  colorEventoSeleccionado: string = '#3f51b5'; // Color por defecto
  
  coloresDisponibles: string[] = [
    '#3f51b5', // Azul (defecto)
    '#e57373', // Rojo
    '#81c784', // Verde
    '#ffb74d', // Naranja
    '#9575cd', // Púrpura
    '#4fc3f7', // Azul claro
    '#aed581', // Verde claro
    '#f06292'  // Rosa
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EventoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      evento: Partial<Evento>,
      modoEdicion: boolean,
      esNuevo?: boolean
    }
  ) {
    this.modoEdicion = data.modoEdicion;
    this.esNuevo = data.esNuevo || false;
    this.esCitacionJuicio = data.evento.esCitacionJuicio || false;
    
    if (data.evento.color) {
      this.colorEventoSeleccionado = data.evento.color;
    }
    
    this.eventoForm = this.fb.group({
      titulo: [data.evento.titulo || '', Validators.required],
      fecha: [data.evento.fecha ? new Date(data.evento.fecha) : new Date(), Validators.required],
      horaInicio: [data.evento.horaInicio || ''],
      horaFin: [data.evento.horaFin || ''],
      descripcion: [data.evento.descripcion || ''],
      color: [data.evento.color || this.colorEventoSeleccionado],
      direccionJuzgado: [data.evento.direccionJuzgado || ''],
      observaciones: [data.evento.observaciones || '']
    });
    
    if (!this.modoEdicion) {
      this.eventoForm.disable();
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.eventoForm.valid) {
      const eventoActualizado: Evento = {
        id: this.data.evento.id || '',
        ...this.eventoForm.value,
        esCitacionJuicio: this.esCitacionJuicio,
        episodioId: this.data.evento.episodioId,
        sujetoId: this.data.evento.sujetoId
      };
      
      this.dialogRef.close({
        evento: eventoActualizado,
        accion: this.data.evento.id ? 'actualizar' : 'crear'
      });
    }
  }

  editar(): void {
    this.dialogRef.close({ accion: 'editar' });
  }

  eliminar(): void {
    if (confirm('¿Está seguro de que desea eliminar este evento?')) {
      this.dialogRef.close({
        evento: this.data.evento,
        accion: 'eliminar'
      });
    }
  }

  seleccionarColor(color: string): void {
    this.colorEventoSeleccionado = color;
    this.eventoForm.get('color')?.setValue(color);
  }
}